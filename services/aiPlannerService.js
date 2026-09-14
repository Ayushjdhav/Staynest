const Listing = require("../models/listing");
const Itinerary = require("../models/itinerary");
const GeminiAdapter = require("./ai/geminiAdapter");
const MockAdapter = require("./ai/mockAdapter");
const logger = require("../utils/logger");
const cache = require("../utils/cache");
const { activeListingFilter } = require("../utils/listingQueries");

class AIPlannerService {
    constructor() {
        this.geminiAdapter = new GeminiAdapter();
        this.mockAdapter = new MockAdapter();
    }

    /**
     * Determine active AI Provider
     */
    getProvider() {
        if (process.env.GEMINI_API_KEY) {
            return this.geminiAdapter;
        }
        return this.mockAdapter;
    }

    /**
     * Retrieve matching candidate properties from MongoDB using RAG heuristics
     */
    async retrieveCandidateListings(destination, budgetTier, guests = 2) {
        try {
            const escapedDestination = destination.trim().slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedDestination, "i");
            const priceCaps = { budget: 5000, moderate: 15000, luxury: Number.MAX_SAFE_INTEGER, flexible: Number.MAX_SAFE_INTEGER };

            // 1. Direct location match
            let listings = await Listing.find({
                $and: [
                    activeListingFilter,
                    { maxGuests: { $gte: Number(guests) || 1 } },
                    { price: { $lte: priceCaps[budgetTier] || Number.MAX_SAFE_INTEGER } },
                    { $or: [{ location: regex }, { country: regex }, { title: regex }, { description: regex }] },
                ],
            })
                .sort({ avgRating: -1, price: 1 })
                .limit(6)
                .lean();

            // 2. Fallback to high-rated properties if no exact city match found
            if (!listings || listings.length === 0) {
                listings = await Listing.find({ $and: [activeListingFilter, { maxGuests: { $gte: Number(guests) || 1 } }] })
                    .sort({ avgRating: -1, price: 1 })
                    .limit(6)
                    .lean();
            }

            return listings;
        } catch (error) {
            logger.error(`Error querying candidate listings for AI planner: ${error.message}`);
            return [];
        }
    }

    /**
     * Generate and persist an AI Travel Itinerary
     */
    async planTrip({
        userId = null,
        destination,
        days = 3,
        budgetTier = "moderate",
        budgetAmount = 0,
        interests = ["Sightseeing", "Food"],
        guests = 2,
    }) {
        const cacheKey = `itinerary_cache:${destination.toLowerCase()}:${days}:${budgetTier}:${interests.sort().join(",")}`;
        const cachedPlan = await cache.get(cacheKey);
        if (cachedPlan) return cachedPlan;

        // Fetch candidate listings from MongoDB
        const candidateListings = await this.retrieveCandidateListings(destination, budgetTier, guests);

        let generatedPlan;
        const provider = this.getProvider();

        try {
            logger.info(`Generating AI itinerary for ${destination} using ${provider.constructor.name}...`);
            generatedPlan = await provider.generateItinerary({
                destination,
                days,
                budgetTier,
                budgetAmount,
                interests,
                guests,
                candidateListings,
            });
        } catch (err) {
            logger.warn(`AI Provider failed (${err.message}). Falling back to Smart Heuristic Adapter...`);
            generatedPlan = await this.mockAdapter.generateItinerary({
                destination,
                days,
                budgetTier,
                budgetAmount,
                interests,
                guests,
                candidateListings,
            });
        }

        // Map recommended listings to real MongoDB ObjectIds
        const mappedRecommendations = [];
        if (generatedPlan.recommendedListings && Array.isArray(generatedPlan.recommendedListings)) {
            for (const rec of generatedPlan.recommendedListings) {
                let listingDoc = null;
                if (rec.listingId) {
                    listingDoc = candidateListings.find((l) => l._id.toString() === rec.listingId.toString());
                }
                if (!listingDoc && candidateListings.length > 0) {
                    listingDoc = candidateListings[mappedRecommendations.length % candidateListings.length];
                }

                if (listingDoc) {
                    mappedRecommendations.push({
                        listing: listingDoc._id,
                        matchScore: rec.matchScore || 95,
                        whyRecommended: rec.whyRecommended || `Hand-picked top-rated stay in ${listingDoc.location}.`,
                    });
                }
            }
        }

        // Ensure at least 1 stay is linked if candidates exist
        if (mappedRecommendations.length === 0 && candidateListings.length > 0) {
            mappedRecommendations.push({
                listing: candidateListings[0]._id,
                matchScore: 96,
                whyRecommended: `Outstanding stay in ${candidateListings[0].location} matching your trip style.`,
            });
        }

        // Create Itinerary Document
        const newItinerary = new Itinerary({
            user: userId,
            destination,
            days: parseInt(days, 10) || 3,
            budgetTier,
            budgetAmount: parseFloat(budgetAmount) || 0,
            interests,
            guests: parseInt(guests, 10) || 2,
            title: generatedPlan.title || `${days}-Day Trip to ${destination}`,
            summary: generatedPlan.summary || `Personalized travel itinerary for ${destination}.`,
            dailyPlans: generatedPlan.dailyPlans || [],
            recommendedListings: mappedRecommendations,
            packingList: generatedPlan.packingList || [],
            localTips: generatedPlan.localTips || [],
            isPublic: true,
        });

        await newItinerary.save();

        // Populate listings for return
        const populatedItinerary = await Itinerary.findById(newItinerary._id).populate({
            path: "recommendedListings.listing",
            populate: { path: "owner", select: "username avatar" },
        });

        // Cache for 1 hour
        await cache.set(cacheKey, populatedItinerary, 3600);

        return populatedItinerary;
    }
}

module.exports = new AIPlannerService();
