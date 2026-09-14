const request = require("supertest");
const app = require("../app");
const { listingSchema, bookingSchema, plannerQuerySchema } = require("../schema");
const MockAdapter = require("../services/ai/mockAdapter");
const cache = require("../utils/cache");

describe("StayNest AI Marketplace Test Suite", () => {
    // 1. Health Probe
    describe("System Health Checks", () => {
        it("should return status UP on /health", async () => {
            const res = await request(app).get("/health");
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("UP");
            expect(res.body.uptime).toBeGreaterThanOrEqual(0);
        });

        it("should return healthy status on /api/v1/health", async () => {
            const res = await request(app).get("/api/v1/health");
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe("healthy");
            expect(res.body.service).toBe("StayNest API");
        });
    });

    // 2. Joi Schemas Validation
    describe("Validation Schemas", () => {
        it("should validate a correct listing schema", () => {
            const validListing = {
                listing: {
                    title: "Serene Himalayan Mountain Chalet",
                    description: "Enjoy breathtaking snowy mountain vistas with a warm wooden fireplace and panoramic deck.",
                    price: 18000,
                    location: "Manali",
                    country: "India",
                    category: "mountains",
                    propertyType: "chalet",
                    roomType: "entire_place",
                    maxGuests: 4,
                    bedrooms: 2,
                    beds: 2,
                    bathrooms: 2,
                },
            };

            const { error } = listingSchema.validate(validListing);
            expect(error).toBeUndefined();
        });

        it("should reject listing with missing title or invalid price", () => {
            const invalidListing = {
                listing: {
                    title: "",
                    description: "Too short",
                    price: -100,
                    location: "Goa",
                    country: "India",
                    category: "beach",
                },
            };

            const { error } = listingSchema.validate(invalidListing);
            expect(error).toBeDefined();
        });

        it("should validate AI Planner queries", () => {
            const validPlannerQuery = {
                destination: "Goa",
                days: 4,
                budgetTier: "moderate",
                interests: ["Beach", "Food"],
                guests: 2,
            };

            const { error } = plannerQuerySchema.validate(validPlannerQuery);
            expect(error).toBeUndefined();
        });

        it("should validate review schema", () => {
            const validReview = {
                review: {
                    rating: 5,
                    comment: "Fantastic stay! Highly recommended.",
                },
            };
            const { error } = require("../schema").reviewSchema.validate(validReview);
            expect(error).toBeUndefined();
        });

        it("should validate booking schema", () => {
            const validBooking = {
                booking: {
                    listingId: "6a3b7de22ee72130e4a19b7e",
                    checkIn: "2026-10-01",
                    checkOut: "2026-10-05",
                    guestsCount: 2,
                },
            };
            const { error } = bookingSchema.validate(validBooking);
            expect(error).toBeUndefined();
        });
    });

    // 3. AI Travel Planner Heuristic Adapter
    describe("AI Travel Planner Engine", () => {
        it("should generate a multi-day itinerary with matched StayNest properties", async () => {
            const adapter = new MockAdapter();
            const candidateListings = [
                {
                    _id: "6a3b7de22ee72130e4a19b7e",
                    title: "Luxury Beach Villa",
                    location: "Goa",
                    country: "India",
                    category: "beach",
                    price: 14500,
                    amenities: ["wifi", "pool", "ac"],
                },
            ];

            const plan = await adapter.generateItinerary({
                destination: "Goa",
                days: 3,
                budgetTier: "moderate",
                interests: ["Beach", "Food"],
                guests: 2,
                candidateListings,
            });

            expect(plan).toBeDefined();
            expect(plan.title).toContain("Goa");
            expect(plan.dailyPlans.length).toBe(3);
            expect(plan.dailyPlans[0].morning).toBeDefined();
            expect(plan.dailyPlans[0].afternoon).toBeDefined();
            expect(plan.dailyPlans[0].evening).toBeDefined();
            expect(plan.dailyPlans[0].mealRecommendations.length).toBeGreaterThan(0);
            expect(plan.recommendedListings.length).toBe(1);
            expect(plan.recommendedListings[0].listingId).toBe("6a3b7de22ee72130e4a19b7e");
            expect(plan.packingList.length).toBeGreaterThan(0);
            expect(plan.localTips.length).toBeGreaterThan(0);
        });
    });

    // 4. In-Memory & Redis Cache Layer
    describe("Cache Layer", () => {
        it("should set, get, and delete cache keys accurately", async () => {
            const key = "test_key_staynest";
            const val = { sample: "data", count: 42 };

            await cache.set(key, val, 60);
            const retrieved = await cache.get(key);
            expect(retrieved).toEqual(val);

            await cache.del(key);
            const afterDel = await cache.get(key);
            expect(afterDel).toBeNull();
        });
    });
});
