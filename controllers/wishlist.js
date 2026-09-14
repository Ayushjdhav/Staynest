const User = require("../models/user");
const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

// View User Wishlist
module.exports.index = async (req, res) => {
    const user = await User.findById(req.user._id).populate({
        path: "wishlist",
        populate: { path: "owner", select: "username" },
    });

    const savedListings = (user.wishlist || []).filter((l) => l && l.isActive);

    res.render("wishlists/index.ejs", { savedListings });
};

// Toggle Wishlist Status (AJAX & SSR Friendly)
module.exports.toggle = async (req, res) => {
    const { listingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
        if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
            return res.status(400).json({ success: false, message: "Invalid listing ID" });
        }
        throw new ExpressError(400, "Invalid Listing ID");
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
        if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
            return res.status(404).json({ success: false, message: "Listing not found" });
        }
        throw new ExpressError(404, "Listing not found");
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.wishlist.findIndex((id) => id.toString() === listingId);

    let isSaved = false;
    if (existingIndex > -1) {
        user.wishlist.splice(existingIndex, 1);
        isSaved = false;
    } else {
        user.wishlist.push(listing._id);
        isSaved = true;
    }

    await user.save();

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
        return res.json({
            success: true,
            isSaved,
            totalSaved: user.wishlist.length,
            message: isSaved ? "Added to wishlist" : "Removed from wishlist",
        });
    }

    req.flash("success", isSaved ? "❤️ Saved to your wishlist!" : "Removed from your wishlist.");
    res.redirect(req.get("referer") || "/listings");
};
