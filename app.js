if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const connectMongo = require("connect-mongo");
const MongoStore = connectMongo.default || connectMongo.MongoStore || connectMongo;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const multer = require("multer");

const swaggerSpec = require("./utils/swagger");
const logger = require("./utils/logger");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const Notification = require("./models/notification");

// Route imports
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const bookingRouter = require("./routes/booking");
const hostRouter = require("./routes/host");
const wishlistRouter = require("./routes/wishlist");
const plannerRouter = require("./routes/planner");
const notificationRouter = require("./routes/notification");
const apiRouter = require("./routes/api/index");

// =======================
// DATABASE CONNECTION
// =======================
const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function connectDB() {
    try {
        await mongoose.connect(dbUrl);
        logger.info(`✅ Connected to MongoDB (${mongoose.connection.name} @ ${mongoose.connection.host})`);
    } catch (err) {
        logger.error(`❌ MongoDB Connection Failed: ${err.message}`);
        process.exit(1);
    }
}

mongoose.connection.on("disconnected", () => logger.warn("🟡 Mongoose Disconnected"));
mongoose.connection.on("error", (err) => logger.error(`🔴 Mongoose Error: ${err.message}`));

// =======================
// SECURITY & MIDDLEWARE
// =======================
app.use(cors());

// Relaxed Helmet configuration for EJS CDNs, Fonts, Map tiles, and Cloudinary
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// =======================
// HEALTH CHECK
// =======================
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
        timestamp: new Date().toISOString(),
    });
});

// =======================
// SESSION & COOKIES
// =======================
const secret = process.env.SECRET || "staynestproductionsecretkey999";

const sessionOptions = {
    name: "staynest.sid",
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        sameSite: "lax",
    },
};

if (process.env.NODE_ENV !== "test") {
    const store = MongoStore.create({
        mongoUrl: dbUrl,
        crypto: { secret },
        touchAfter: 24 * 3600,
    });
    store.on("error", (e) => logger.error(`SESSION STORE ERROR: ${e.message}`));
    sessionOptions.store = store;
}

app.use(session(sessionOptions));
app.use(flash());

// =======================
// PASSPORT AUTH
// =======================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// =======================
// GLOBAL LOCALS
// =======================
app.use(async (req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.search = req.query.search || "";
    res.locals.activeCategory = req.query.category || "all";
    res.locals.checkIn = req.query.checkIn || "";
    res.locals.checkOut = req.query.checkOut || "";
    res.locals.guests = req.query.guests || "";

    // Unread notification count for badge
    res.locals.unreadCount = 0;
    if (req.user && mongoose.connection.readyState === 1) {
        try {
            res.locals.unreadCount = await Notification.countDocuments({
                recipient: req.user._id,
                isRead: false,
            });
        } catch (e) {
            res.locals.unreadCount = 0;
        }
    }

    next();
});

// =======================
// SWAGGER API DOCS
// =======================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =======================
// WEB & API ROUTES
// =======================
app.get("/", (req, res) => res.redirect("/listings"));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/bookings", bookingRouter);
app.use("/host", hostRouter);
app.use("/wishlists", wishlistRouter);
app.use("/planner", plannerRouter);
app.use("/notifications", notificationRouter);
app.use("/api/v1", apiRouter);
app.use("/", userRouter);

// =======================
// 404 NOT FOUND
// =======================
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// =======================
// CENTRAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
    const isUploadError = err instanceof multer.MulterError || /Only JPEG, PNG, and WebP/.test(err.message || "");
    const statusCode = isUploadError ? 400 : err.statusCode || 500;
    const message = isUploadError && err.code === "LIMIT_FILE_SIZE"
        ? "Each image must be 10 MB or smaller."
        : err.message || "Something went wrong!";

    logger.error(`[${req.method}] ${req.originalUrl} - ${statusCode}: ${message}`);

    if (req.xhr || req.originalUrl.startsWith("/api/")) {
        return res.status(statusCode).json({
            success: false,
            statusCode,
            message,
        });
    }

    res.status(statusCode).render("error", { message });
});

// =======================
// SERVER START
// =======================
const PORT = process.env.PORT || 8080;

async function startServer() {
    await connectDB();
    const server = app.listen(PORT, () => {
        logger.info(`🚀 StayNest Platform running on http://localhost:${PORT}`);
        logger.info(`📚 Swagger API Docs available at http://localhost:${PORT}/api-docs`);
        logger.info(`🤖 StayNest AI Travel Planner live at http://localhost:${PORT}/planner`);
    });
    return server;
}

if (process.env.NODE_ENV !== "test") {
    startServer();
}

module.exports = app;
