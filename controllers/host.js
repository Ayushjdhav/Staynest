const Listing = require("../models/listing");
const Booking = require("../models/booking");
const User = require("../models/user");
const ExpressError = require("../utils/ExpressError");

// Host Analytics Dashboard
module.exports.dashboard = async (req, res) => {
    const hostId = req.user._id;

    // Fetch all listings owned by host
    const hostListings = await Listing.find({ owner: hostId }).sort({ createdAt: -1 });
    const listingIds = hostListings.map((l) => l._id);

    // Fetch all bookings for these listings
    const reservations = await Booking.find({ listing: { $in: listingIds } })
        .populate("listing", "title location image price")
        .populate("guest", "username email phone avatar")
        .sort({ checkIn: -1 });

    // Compute Metrics
    const totalListings = hostListings.length;
    const activeListings = hostListings.filter((l) => l.isActive).length;
    const totalReservations = reservations.filter((r) => r.status !== "cancelled").length;

    // Total Earnings (sum of basePrice + cleaningFee)
    const totalEarnings = reservations
        .filter((r) => r.status === "confirmed" || r.status === "completed")
        .reduce((sum, r) => sum + (r.basePrice + r.cleaningFee), 0);

    // Host Average Rating
    const ratedListings = hostListings.filter((l) => l.avgRating > 0);
    const avgRating =
        ratedListings.length > 0
            ? (ratedListings.reduce((sum, l) => sum + l.avgRating, 0) / ratedListings.length).toFixed(1)
            : "5.0";

    const upcomingCheckIns = reservations.filter(
        (r) => new Date(r.checkIn) >= new Date() && r.status === "confirmed"
    );

    res.render("host/dashboard.ejs", {
        hostListings,
        reservations,
        totalListings,
        activeListings,
        totalReservations,
        totalEarnings,
        avgRating,
        upcomingCheckIns,
    });
};

// Render Become a Host Onboarding
module.exports.renderBecomeHost = (req, res) => {
    if (req.user && (req.user.role === "host" || req.user.role === "admin")) {
        return res.redirect("/host/dashboard");
    }
    res.render("host/become-host.ejs");
};

// Upgrade User to Host
module.exports.upgradeToHost = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) throw new ExpressError(404, "User not found");

    user.role = "host";
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.phone) user.phone = req.body.phone;

    await user.save();
    req.flash("success", "🎉 Welcome to the Host Community! You can now list properties.");
    res.redirect("/listings/new");
};

// Toggle Listing Active Status (Pause / Publish)
module.exports.toggleListingStatus = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) throw new ExpressError(404, "Listing not found");
    if (!listing.owner.equals(req.user._id) && req.user.role !== "admin") {
        throw new ExpressError(403, "Unauthorized");
    }

    listing.isActive = !listing.isActive;
    await listing.save();

    req.flash(
        "success",
        `Listing is now ${listing.isActive ? "Active (Live on marketplace)" : "Paused (Hidden from search)"}.`
    );
    res.redirect("/host/dashboard");
};
