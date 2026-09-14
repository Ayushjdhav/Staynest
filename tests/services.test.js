const MockAdapter = require("../services/ai/mockAdapter");
const GeminiAdapter = require("../services/ai/geminiAdapter");
const AIProviderInterface = require("../services/ai/aiProviderInterface");

describe("AI Services & Adapters Unit Test Suite", () => {
    describe("AIProviderInterface Contract", () => {
        it("should throw error if generateItinerary is called directly on base interface", async () => {
            const baseInterface = new AIProviderInterface();
            await expect(baseInterface.generateItinerary({})).rejects.toThrow(
                "Method generateItinerary() must be implemented by subclass"
            );
        });

        it("should return false for default isConfigured()", () => {
            const baseInterface = new AIProviderInterface();
            expect(baseInterface.isConfigured()).toBe(false);
        });
    });

    describe("MockAdapter (Smart Heuristic Fallback)", () => {
        let mockAdapter;

        beforeEach(() => {
            mockAdapter = new MockAdapter();
        });

        it("should report as configured", () => {
            expect(mockAdapter.isConfigured()).toBe(true);
        });

        it("should generate a complete structured itinerary", async () => {
            const candidateListings = [
                {
                    _id: "650000000000000000000001",
                    title: "Seaside Villa",
                    location: "Goa",
                    country: "India",
                    category: "beach",
                    price: 12000,
                    amenities: ["wifi", "pool"],
                },
            ];

            const result = await mockAdapter.generateItinerary({
                destination: "Goa",
                days: 3,
                budgetTier: "moderate",
                interests: ["Beach", "Food"],
                guests: 2,
                candidateListings,
            });

            expect(result).toBeDefined();
            expect(result.title).toContain("Goa");
            expect(result.dailyPlans.length).toBe(3);
            expect(result.recommendedListings.length).toBe(1);
            expect(result.recommendedListings[0].listingId).toBe("650000000000000000000001");
            expect(Array.isArray(result.packingList)).toBe(true);
            expect(Array.isArray(result.localTips)).toBe(true);
        });

        it("should generate fallback itinerary when candidateListings is empty", async () => {
            const result = await mockAdapter.generateItinerary({
                destination: "Jaipur",
                days: 2,
                budgetTier: "luxury",
                interests: ["Culture"],
                guests: 4,
                candidateListings: [],
            });

            expect(result).toBeDefined();
            expect(result.dailyPlans.length).toBe(2);
            expect(result.recommendedListings).toEqual([]);
        });
    });

    describe("GeminiAdapter Configuration & Safeguards", () => {
        it("should return false for isConfigured when API key is missing", () => {
            const adapter = new GeminiAdapter("");
            expect(adapter.isConfigured()).toBe(false);
        });

        it("should throw an error if generateItinerary is called without API key", async () => {
            const adapter = new GeminiAdapter("");
            await expect(
                adapter.generateItinerary({
                    destination: "Delhi",
                    days: 2,
                    budgetTier: "moderate",
                    interests: [],
                    guests: 1,
                    candidateListings: [],
                })
            ).rejects.toThrow("GEMINI_API_KEY is not configured");
        });

        it("should return true for isConfigured when API key is supplied", () => {
            const adapter = new GeminiAdapter("dummy_key_12345");
            expect(adapter.isConfigured()).toBe(true);
        });
    });
});
