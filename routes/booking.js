const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateBooking, isBookingGuestOrHost } = require("../middleware");
const bookingsController = require("../controllers/bookings");

// My Bookings & Create Booking
router
    .route("/")
    .get(isLoggedIn, wrapAsync(bookingsController.index))
    .post(isLoggedIn, validateBooking, wrapAsync(bookingsController.createBooking));

// Booking Receipt / Detail
router.get("/:id", isLoggedIn, isBookingGuestOrHost, wrapAsync(bookingsController.showBooking));

// Cancel Booking
router.post("/:id/cancel", isLoggedIn, isBookingGuestOrHost, wrapAsync(bookingsController.cancelBooking));

module.exports = router;
