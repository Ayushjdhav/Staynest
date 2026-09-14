const Listing = require("../models/listing");
const Review = require("../models/review");
const Notification = require("../models/notification");

// CREATE REVIEW
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    // Recalculate listing rating aggregate
    await Review.recalculateListingRating(listing._id);

    // Notify listing owner if different user
    if (listing.owner && !listing.owner.equals(req.user._id)) {
        await Notification.create({
            recipient: listing.owner,
            sender: req.user._id,
            type: "new_review",
            title: "🌟 New Review on Your Property",
            message: `${req.user.username} left a ${newReview.rating}-star review on "${listing.title}".`,
            link: `/listings/${listing._id}`,
        });
    }

    req.flash("success", "Review posted successfully!");
    res.redirect(`/listings/${listing._id}`);
};

// DELETE REVIEW
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    // Recalculate listing rating aggregate
    await Review.recalculateListingRating(id);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
};
