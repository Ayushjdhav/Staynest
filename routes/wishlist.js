const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware");
const wishlistController = require("../controllers/wishlist");

// View Wishlist
router.get("/", isLoggedIn, wrapAsync(wishlistController.index));

// Toggle Wishlist Status
router.post("/toggle/:listingId", isLoggedIn, wrapAsync(wishlistController.toggle));

module.exports = router;
