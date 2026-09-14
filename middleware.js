const rateLimit = require("express-rate-limit");
const Listing = require("./models/listing");
const Review = require("./models/review");
const Booking = require("./models/booking");
const ExpressError = require("./utils/ExpressError");
const {
    listingSchema,
    reviewSchema,
    bookingSchema,
    plannerQuerySchema,
} = require("./schema");

// Rate limiters
module.exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 150 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports.aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 AI trip generations per minute per IP
    message: {
        success: false,
        message: "AI Planner rate limit exceeded. Please wait a moment before generating another trip.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to proceed!");
        if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isHost = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in as a host!");
        return res.redirect("/login");
    }
    if (req.user.role !== "host" && req.user.role !== "admin") {
        req.flash("error", "Host privileges required. Please register as a host!");
        return res.redirect("/host/become-a-host");
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Admin authentication required!");
        return res.redirect("/login");
    }
    if (req.user.role !== "admin") {
        req.flash("error", "Access denied: Admins only.");
        return res.redirect("/listings");
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const isListingOwner = listing.owner && listing.owner.equals(req.user._id);
    const isUserAdmin = req.user && req.user.role === "admin";

    if (!isListingOwner && !isUserAdmin) {
        req.flash("error", "You do not have permission to modify this listing!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    const isAuthor = review.author && review.author.equals(req.user._id);
    const isUserAdmin = req.user && req.user.role === "admin";

    if (!isAuthor && !isUserAdmin) {
        req.flash("error", "You do not have permission to delete this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

module.exports.isBookingGuestOrHost = async (req, res, next) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    const isGuest = booking.guest.equals(req.user._id);
    const isHost = booking.host.equals(req.user._id);
    const isUserAdmin = req.user.role === "admin";

    if (!isGuest && !isHost && !isUserAdmin) {
        req.flash("error", "Unauthorized access to this booking!");
        return res.redirect("/bookings");
    }

    req.booking = booking;
    next();
};

module.exports.validateListing = (req, res, next) => {
    // Normalize amenities if string
    if (req.body.listing && typeof req.body.listing.amenities === "string") {
        req.body.listing.amenities = req.body.listing.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};

module.exports.validatePlannerQuery = (req, res, next) => {
    // Normalize interests if string
    if (req.body && typeof req.body.interests === "string") {
        req.body.interests = req.body.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    const { error } = plannerQuerySchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
};