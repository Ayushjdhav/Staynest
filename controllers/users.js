const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/booking");

// RENDER SIGNUP
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// SIGNUP
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", `Welcome to StayNest, ${username}! Find your next stay, with confidence.`);
            const redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// RENDER LOGIN
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// LOGIN
module.exports.login = async (req, res) => {
    req.flash("success", `Welcome back, ${req.user.username}!`);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You have logged out successfully.");
        res.redirect("/listings");
    });
};

// USER PROFILE
module.exports.showProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    const hostListings = await Listing.find({ owner: req.user._id });
    const userBookings = await Booking.find({ guest: req.user._id }).populate("listing");

    res.render("users/profile.ejs", { user, hostListings, userBookings });
};

// UPDATE PROFILE
module.exports.updateProfile = async (req, res) => {
    const { bio, phone } = req.body;
    const user = await User.findById(req.user._id);

    if (bio !== undefined) user.bio = bio;
    if (phone !== undefined) user.phone = phone;

    await user.save();
    req.flash("success", "Profile updated successfully!");
    res.redirect("/profile");
};