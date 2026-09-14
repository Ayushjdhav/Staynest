const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware");
const userController = require("../controllers/users");

// Signup Routes
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Routes
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// Logout Route
router.get("/logout", userController.logout);

// User Profile Routes
router
    .route("/profile")
    .get(isLoggedIn, wrapAsync(userController.showProfile))
    .post(isLoggedIn, wrapAsync(userController.updateProfile));

module.exports = router;