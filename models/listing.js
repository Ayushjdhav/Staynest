const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
const { FALLBACK_IMAGE_URL, getListingDisplayImage, getListingImageUrls } = require("../utils/images");

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            url: {
                type: String,
                default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
            },
            filename: {
                type: String,
                default: "listingimage",
            },
        },
        images: [
            {
                url: String,
                filename: String,
                isCover: { type: Boolean, default: false },
            },
        ],
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "trending",
                "rooms",
                "iconic-cities",
                "mountains",
                "amazing-views",
                "beach",
                "camping",
                "castles",
                "arctic",
                "farms",
                "pools",
                "forest",
                "villas",
                "luxury",
            ],
            default: "trending",
        },
        propertyType: {
            type: String,
            enum: [
                "villa",
                "apartment",
                "cabin",
                "cottage",
                "house",
                "hotel",
                "chalet",
                "mansion",
                "resort",
                "treehouse",
            ],
            default: "apartment",
        },
        roomType: {
            type: String,
            enum: ["entire_place", "private_room", "shared_room"],
            default: "entire_place",
        },
        amenities: {
            type: [String],
            default: ["wifi", "ac", "kitchen"],
        },
        bedrooms: {
            type: Number,
            default: 1,
            min: 1,
        },
        beds: {
            type: Number,
            default: 1,
            min: 1,
        },
        bathrooms: {
            type: Number,
            default: 1,
            min: 0.5,
        },
        maxGuests: {
            type: Number,
            default: 2,
            min: 1,
        },
        cleaningFee: {
            type: Number,
            default: 500,
            min: 0,
        },
        cancellationPolicy: {
            type: String,
            enum: ["flexible", "moderate", "strict"],
            default: "flexible",
        },
        houseRules: {
            type: [String],
            default: ["No smoking inside", "Check-in after 2:00 PM", "Check-out by 11:00 AM"],
        },
        avgRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        reviewCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes
listingSchema.index({ geometry: "2dsphere" });
listingSchema.index({ title: "text", description: "text", location: "text", country: "text" });
listingSchema.index({ category: 1, price: 1, avgRating: -1 });
listingSchema.index({ owner: 1, isActive: 1 });
listingSchema.index({ isFeatured: 1, createdAt: -1 });

// Virtual to ensure an image gallery array is always available
listingSchema.virtual("allImages").get(function () {
    const imageUrls = getListingImageUrls(this);
    return imageUrls.length ? imageUrls : [FALLBACK_IMAGE_URL];
});

// Primary display image
listingSchema.virtual("displayImage").get(function () {
    return getListingDisplayImage(this);
});

// Cascade delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing && listing.reviews && listing.reviews.length > 0) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
