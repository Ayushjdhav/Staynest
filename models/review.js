const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema(
    {
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        ratings: {
            cleanliness: { type: Number, min: 1, max: 5, default: 5 },
            accuracy: { type: Number, min: 1, max: 5, default: 5 },
            checkIn: { type: Number, min: 1, max: 5, default: 5 },
            communication: { type: Number, min: 1, max: 5, default: 5 },
            location: { type: Number, min: 1, max: 5, default: 5 },
            value: { type: Number, min: 1, max: 5, default: 5 },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// Recalculate listing average rating helper
reviewSchema.statics.recalculateListingRating = async function (listingId) {
    const Listing = mongoose.model("Listing");
    const listing = await Listing.findById(listingId).populate("reviews");
    if (!listing) return;

    if (!listing.reviews || listing.reviews.length === 0) {
        listing.avgRating = 0;
        listing.reviewCount = 0;
    } else {
        const total = listing.reviews.reduce((sum, rev) => sum + (rev.rating || 0), 0);
        listing.reviewCount = listing.reviews.length;
        listing.avgRating = Number((total / listing.reviews.length).toFixed(1));
    }
    await listing.save();
};

module.exports = mongoose.model("Review", reviewSchema);