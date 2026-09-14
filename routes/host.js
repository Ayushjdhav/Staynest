const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isHost } = require("../middleware");
const hostController = require("../controllers/host");

// Host Dashboard
router.get("/dashboard", isLoggedIn, isHost, wrapAsync(hostController.dashboard));

// Become a Host Onboarding
router
    .route("/become-a-host")
    .get(isLoggedIn, hostController.renderBecomeHost)
    .post(isLoggedIn, wrapAsync(hostController.upgradeToHost));

// Toggle Listing Active Status
router.post("/listings/:id/toggle", isLoggedIn, isHost, wrapAsync(hostController.toggleListingStatus));

module.exports = router;
