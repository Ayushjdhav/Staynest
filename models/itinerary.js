const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itinerarySchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        destination: {
            type: String,
            required: true,
            trim: true,
        },
        days: {
            type: Number,
            required: true,
            min: 1,
            max: 14,
        },
        budgetTier: {
            type: String,
            enum: ["budget", "moderate", "luxury", "flexible"],
            default: "moderate",
        },
        budgetAmount: {
            type: Number,
            default: 0,
        },
        interests: {
            type: [String],
            default: ["Sightseeing", "Food & Dining", "Culture & History"],
        },
        guests: {
            type: Number,
            default: 2,
            min: 1,
        },
        title: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        dailyPlans: [
            {
                day: Number,
                title: String,
                theme: String,
                morning: {
                    activity: String,
                    description: String,
                    location: String,
                    estimatedCost: Number,
                },
                afternoon: {
                    activity: String,
                    description: String,
                    location: String,
                    estimatedCost: Number,
                },
                evening: {
                    activity: String,
                    description: String,
                    location: String,
                    estimatedCost: Number,
                },
                mealRecommendations: [
                    {
                        mealType: String,
                        name: String,
                        cuisine: String,
                        description: String,
                        priceRange: String,
                    },
                ],
                estimatedDailyCost: Number,
            },
        ],
        recommendedListings: [
            {
                listing: {
                    type: Schema.Types.ObjectId,
                    ref: "Listing",
                },
                matchScore: {
                    type: Number,
                    default: 95,
                },
                whyRecommended: String,
            },
        ],
        packingList: [String],
        localTips: [String],
        isPublic: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

itinerarySchema.index({ user: 1, createdAt: -1 });
itinerarySchema.index({ destination: "text", title: "text" });

module.exports = mongoose.model("Itinerary", itinerarySchema);
