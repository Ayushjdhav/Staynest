const Booking = require("../models/booking");
const Listing = require("../models/listing");
const Notification = require("../models/notification");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

// Check availability and calculate price estimate
module.exports.checkAvailability = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guestsCount = 1 } = req.query;

    if (!checkIn || !checkOut) {
        return res.status(400).json({ success: false, message: "Check-in and Check-out dates are required" });
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (Number(guestsCount) > listing.maxGuests) {
        return res.status(400).json({ success: false, message: `This stay allows a maximum of ${listing.maxGuests} guests.` });
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate >= endDate) {
        return res.status(400).json({ success: false, message: "Check-out date must be after check-in date" });
    }

    const isOverlapping = await Booking.hasOverlap(id, startDate, endDate);
    if (isOverlapping) {
        return res.json({
            success: false,
            available: false,
            message: "Selected dates are already booked. Please choose different dates.",
        });
    }

    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = listing.price * nights;
    const cleaningFee = listing.cleaningFee || 500;
    const serviceFee = Math.round(basePrice * 0.12);
    const taxPrice = Math.round((basePrice + serviceFee) * 0.18); // 18% GST
    const totalPrice = basePrice + cleaningFee + serviceFee + taxPrice;

    res.json({
        success: true,
        available: true,
        pricing: {
            nightlyRate: listing.price,
            nights,
            basePrice,
            cleaningFee,
            serviceFee,
            taxPrice,
            totalPrice,
        },
    });
};

// Create a new Booking
module.exports.createBooking = async (req, res) => {
    const { listingId, checkIn, checkOut, guestsCount = 1, specialRequests = "" } = req.body.booking;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        throw new ExpressError(404, "Invalid Listing ID");
    }

    const listing = await Listing.findById(listingId).populate("owner");
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    if (!listing.isActive) {
        throw new ExpressError(409, "This listing is not currently accepting reservations.");
    }

    if (Number(guestsCount) > listing.maxGuests) {
        req.flash("error", `This stay allows a maximum of ${listing.maxGuests} guests.`);
        return res.redirect(`/listings/${listingId}`);
    }

    // Prevent booking own property
    if (listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You cannot book your own property!");
        return res.redirect(`/listings/${listingId}`);
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (startDate < new Date(new Date().setHours(0, 0, 0, 0))) {
        req.flash("error", "Check-in date cannot be in the past!");
        return res.redirect(`/listings/${listingId}`);
    }

    if (startDate >= endDate) {
        req.flash("error", "Check-out date must be after check-in date!");
        return res.redirect(`/listings/${listingId}`);
    }

    // Atomic overlap verification
    const isOverlapping = await Booking.hasOverlap(listingId, startDate, endDate);
    if (isOverlapping) {
        req.flash("error", "Sorry, those dates were just reserved by another guest. Please choose different dates.");
        return res.redirect(`/listings/${listingId}`);
    }

    const diffTime = Math.abs(endDate - startDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const basePrice = listing.price * nights;
    const cleaningFee = listing.cleaningFee || 500;
    const serviceFee = Math.round(basePrice * 0.12);
    const taxPrice = Math.round((basePrice + serviceFee) * 0.18);
    const totalPrice = basePrice + cleaningFee + serviceFee + taxPrice;

    const booking = new Booking({
        listing: listing._id,
        guest: req.user._id,
        host: listing.owner._id,
        checkIn: startDate,
        checkOut: endDate,
        nights,
        guestsCount: Number(guestsCount) || 1,
        basePrice,
        cleaningFee,
        serviceFee,
        taxPrice,
        totalPrice,
        status: "confirmed",
        paymentStatus: "paid",
        specialRequests,
    });

    await booking.save();

    // Create In-App Notification for Host
    await Notification.create({
        recipient: listing.owner._id,
        sender: req.user._id,
        type: "booking_created",
        title: "🎉 New Reservation Received!",
        message: `${req.user.username} reserved "${listing.title}" for ${nights} nights (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}).`,
        link: `/bookings/${booking._id}`,
    });

    req.flash("success", "🎉 Booking confirmed! Have an amazing trip.");
    res.redirect(`/bookings/${booking._id}`);
};

// List User Bookings (My Trips)
module.exports.index = async (req, res) => {
    const bookings = await Booking.find({ guest: req.user._id })
        .populate({
            path: "listing",
            select: "title location country image images price",
        })
        .populate("host", "username email phone")
        .sort({ checkIn: -1 });

    const now = new Date();
    const upcoming = bookings.filter((b) => new Date(b.checkOut) >= now && b.status !== "cancelled");
    const past = bookings.filter((b) => new Date(b.checkOut) < now && b.status !== "cancelled");
    const cancelled = bookings.filter((b) => b.status === "cancelled");

    res.render("bookings/index.ejs", {
        bookings,
        upcoming,
        past,
        cancelled,
    });
};

// Show single Booking confirmation receipt
module.exports.showBooking = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Invalid Booking ID");
    }

    const booking = await Booking.findById(id)
        .populate({
            path: "listing",
            populate: { path: "owner", select: "username email phone avatar" },
        })
        .populate("guest", "username email phone avatar")
        .populate("host", "username email phone avatar");

    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    // Verify authorized user (guest, host, or admin)
    const isGuest = booking.guest._id.equals(req.user._id);
    const isHost = booking.host._id.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isGuest && !isHost && !isAdmin) {
        req.flash("error", "Unauthorized access to this booking!");
        return res.redirect("/bookings");
    }

    res.render("bookings/show.ejs", { booking });
};

// Cancel Booking
module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const { reason = "Guest cancelled" } = req.body;

    const booking = await Booking.findById(id).populate("listing guest host");
    if (!booking) {
        req.flash("error", "Booking not found!");
        return res.redirect("/bookings");
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    booking.cancellationReason = reason;
    await booking.save();

    // Notify other party
    const notifyRecipient = booking.guest._id.equals(req.user._id) ? booking.host._id : booking.guest._id;
    await Notification.create({
        recipient: notifyRecipient,
        sender: req.user._id,
        type: "booking_cancelled",
        title: "⚠️ Booking Cancelled",
        message: `Reservation for "${booking.listing.title}" has been cancelled.`,
        link: `/bookings/${booking._id}`,
    });

    req.flash("success", "Reservation cancelled and refund initiated.");
    res.redirect(`/bookings/${id}`);
};
