const AIProviderInterface = require("./aiProviderInterface");

class MockAdapter extends AIProviderInterface {
    async generateItinerary({
        destination,
        days = 3,
        budgetTier = "moderate",
        budgetAmount = 0,
        interests = ["Sightseeing"],
        guests = 2,
        candidateListings = [],
    }) {
        const numDays = Math.min(Math.max(parseInt(days, 10) || 3, 1), 14);

        // Curate matched listings
        const recommendedListings = candidateListings.slice(0, 3).map((l, index) => {
            const matchScore = 98 - index * 4;
            let why = `Top-rated verified StayNest stay in ${l.location || destination} with ${l.category || "great"} views`;
            if (l.amenities && l.amenities.length > 0) {
                why += ` featuring ${l.amenities.slice(0, 3).join(", ")}.`;
            } else {
                why += ` perfectly suited for ${guests} guests.`;
            }

            return {
                listingId: l._id.toString(),
                matchScore,
                whyRecommended: why,
            };
        });

        // Activity templates based on interests
        const themes = [
            "Iconic Landmarks & Historic Walking Tours",
            "Hidden Gems & Local Culinary Delights",
            "Nature Escapes & Breathtaking Panoramas",
            "Arts, Culture & Boutique Neighborhoods",
            "Sunset Vistas & Scenic Waterfronts",
            "Relaxation & Architecture Trails",
            "Outdoor Discovery & Local Markets",
        ];

        const dailyPlans = [];
        for (let i = 1; i <= numDays; i++) {
            const theme = themes[(i - 1) % themes.length];
            const baseDailyCost = budgetTier === "luxury" ? 5000 : budgetTier === "budget" ? 1200 : 2500;

            dailyPlans.push({
                day: i,
                title: `Day ${i}: ${theme}`,
                theme,
                morning: {
                    activity: `Explore ${destination}'s Historical Core & Old Town`,
                    description: `Begin the day early to enjoy pleasant morning weather. Take a scenic walking tour through iconic streets, artisan bakeries, and heritage architecture.`,
                    location: `${destination} Central Quarter`,
                    estimatedCost: Math.round(baseDailyCost * 0.25),
                },
                afternoon: {
                    activity: `Visit Premier Cultural Museum & Scenic Gardens`,
                    description: `Immerse in local art and botanical beauty. Great spot for photography and relaxing strolls.`,
                    location: `${destination} Heritage Park`,
                    estimatedCost: Math.round(baseDailyCost * 0.35),
                },
                evening: {
                    activity: `Sunset Golden Hour & Riverside Promenade`,
                    description: `Enjoy breathtaking sunset viewpoints followed by an evening stroll through lively illuminated markets and artisan cafes.`,
                    location: `${destination} Sunset Point`,
                    estimatedCost: Math.round(baseDailyCost * 0.4),
                },
                mealRecommendations: [
                    {
                        mealType: "Lunch",
                        name: `The ${destination} Local Bistro`,
                        cuisine: "Regional Specialties",
                        description: "Must-try authentic local platters and freshly squeezed juices.",
                        priceRange: budgetTier === "luxury" ? "₹₹₹" : "₹₹",
                    },
                    {
                        mealType: "Dinner",
                        name: `Skyline Terrace & Eatery`,
                        cuisine: "Local & Fusion",
                        description: "Warm ambience with panoramic views of the evening city lights.",
                        priceRange: budgetTier === "luxury" ? "₹₹₹₹" : "₹₹₹",
                    },
                ],
                estimatedDailyCost: baseDailyCost,
            });
        }

        return {
            title: `${numDays}-Day Explorer Journey to ${destination}`,
            summary: `Experience the best of ${destination} with this tailored ${numDays}-day itinerary. Designed around ${interests.join(", ")}, blending authentic local flavors, iconic landmarks, and hand-picked StayNest verified stays.`,
            recommendedListings,
            dailyPlans,
            packingList: [
                "Comfortable walking shoes",
                "Lightweight travel camera or power bank",
                "Weather-appropriate layered clothing",
                "Universal travel adapter",
                "Reusable water bottle & sunscreen",
            ],
            localTips: [
                `Local public transit in ${destination} is efficient and cost-effective.`,
                "Reserve popular dining venues in advance for weekend dinners.",
                "Keep a digital copy of your bookings and check-in confirmation handy.",
            ],
        };
    }
}

module.exports = MockAdapter;
