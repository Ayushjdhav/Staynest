const express = require("express");
const router = express.Router();
const Listing = require("../../models/listing");
const Booking = require("../../models/booking");
const aiPlannerService = require("../../services/aiPlannerService");
const wrapAsync = require("../../utils/wrapAsync");
const { isLoggedIn, apiLimiter, aiLimiter } = require("../../middleware");

/**
 * @openapi
 * /api/v1/listings:
 *   get:
 *     summary: Retrieve listings with filters and pagination
 *     tags: [Listings]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 *     responses:
 *       200:
 *         description: List of properties
 */
router.get("/listings", apiLimiter, wrapAsync(async (req, res) => {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) {
        const searchRegex = new RegExp(search.trim(), "i");
        query.$or = [{ title: searchRegex }, { location: searchRegex }, { country: searchRegex }];
    }
    if (category && category !== "all") query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);
    const total = await Listing.countDocuments(query);

    const listings = await Listing.find(query)
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit)
        .sort({ createdAt: -1 });

    res.json({
        success: true,
        total,
        page: currentPage,
        totalPages: Math.ceil(total / pageLimit),
        listings,
    });
}));

/**
 * @openapi
 * /api/v1/listings/{id}:
 *   get:
 *     summary: Get single listing details
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Property details
 */
router.get("/listings/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate("reviews")
        .populate("owner", "username email avatar isVerified");

    if (!listing) {
        return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.json({ success: true, listing });
}));

/**
 * @openapi
 * /api/v1/planner/generate:
 *   post:
 *     summary: Generate custom AI travel itinerary and property recommendations
 *     tags: [AI Travel Planner]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [destination]
 *             properties:
 *               destination: { type: string, example: "Goa" }
 *               days: { type: integer, example: 3 }
 *               budgetTier: { type: string, example: "moderate" }
 *               interests: { type: array, items: { type: string }, example: ["Beach", "Seafood"] }
 *               guests: { type: integer, example: 2 }
 *     responses:
 *       200:
 *         description: Generated itinerary and recommended listings
 */
router.post("/planner/generate", aiLimiter, wrapAsync(async (req, res) => {
    const { destination, days = 3, budgetTier = "moderate", budgetAmount = 0, interests = ["Sightseeing"], guests = 2 } = req.body;

    const itinerary = await aiPlannerService.planTrip({
        userId: req.user ? req.user._id : null,
        destination,
        days,
        budgetTier,
        budgetAmount,
        interests,
        guests,
    });

    res.json({ success: true, itinerary });
}));

/**
 * @openapi
 * /api/v1/ai/ask:
 *   post:
 *     summary: Grounded travel and listing AI concierge
 *     tags: [AI Assistant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string, example: "Do you have villas in Goa with a private pool?" }
 *               listingId: { type: string, example: "64fa..." }
 *     responses:
 *       200:
 *         description: Grounded response with real listing citations
 */
router.post("/ai/ask", aiLimiter, wrapAsync(async (req, res) => {
    const { message, listingId, history } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, reply: "Please enter a question or destination." });
    }

    const aiAssistantService = require("../../services/aiAssistantService");
    const result = await aiAssistantService.ask({
        message,
        listingId,
        conversationHistory: history || [],
    });

    res.json(result);
}));

/**
 * @openapi
 * /api/v1/health:
 *   get:
 *     summary: Health and readiness probe
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get("/health", (req, res) => {
    res.json({
        status: "healthy",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        service: "StayNest API",
    });
});

module.exports = router;
