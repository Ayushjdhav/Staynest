const axios = require("axios");
const AIProviderInterface = require("./aiProviderInterface");
const logger = require("../../utils/logger");

class GeminiAdapter extends AIProviderInterface {
    constructor(apiKey) {
        super();
        this.apiKey = apiKey || process.env.GEMINI_API_KEY;
        this.model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    }

    isConfigured() {
        return !!this.apiKey;
    }

    async generateItinerary({
        destination,
        days,
        budgetTier,
        budgetAmount,
        interests,
        guests,
        candidateListings,
    }) {
        if (!this.isConfigured()) {
            throw new Error("GEMINI_API_KEY is not configured");
        }

        const listingsContext = candidateListings.map((l) => ({
            id: l._id.toString(),
            title: l.title,
            description: l.description,
            price: l.price,
            location: l.location,
            country: l.country,
            category: l.category,
            amenities: l.amenities || [],
            maxGuests: l.maxGuests || 2,
            avgRating: l.avgRating || 0,
        }));

        const prompt = `You are StayNest's expert AI Travel Concierge.
Generate an extraordinary, highly customized ${days}-day travel itinerary for "${destination}".

Trip Parameters:
- Destination: ${destination}
- Duration: ${days} days
- Budget Tier: ${budgetTier} ${budgetAmount ? `(Approx Budget: ₹${budgetAmount})` : ""}
- Interests/Vibes: ${interests.join(", ")}
- Number of Travelers: ${guests}

Available Real StayNest Properties in our database (Recommend 1 to 3 best matching stays from this exact list only):
${JSON.stringify(listingsContext, null, 2)}

You MUST reply with ONLY a raw, valid JSON object without any markdown code fences or backticks. Format:
{
  "title": "A catchy, evocative trip title",
  "summary": "2-3 sentences overview of the trip experience",
  "recommendedListings": [
    {
      "listingId": "Exact ID from the provided listings list",
      "matchScore": 95,
      "whyRecommended": "1-2 sentences explaining why this stay fits their itinerary, budget, and vibe"
    }
  ],
  "dailyPlans": [
    {
      "day": 1,
      "title": "Day 1 Theme Title",
      "theme": "Brief vibe theme",
      "morning": {
        "activity": "Name of morning activity",
        "description": "Engaging description with insider tip",
        "location": "Specific place name",
        "estimatedCost": 500
      },
      "afternoon": {
        "activity": "Name of afternoon activity",
        "description": "Engaging description with insider tip",
        "location": "Specific place name",
        "estimatedCost": 800
      },
      "evening": {
        "activity": "Name of evening activity",
        "description": "Engaging description with insider tip",
        "location": "Specific place name",
        "estimatedCost": 1200
      },
      "mealRecommendations": [
        {
          "mealType": "Lunch",
          "name": "Restaurant / Cafe Name",
          "cuisine": "Cuisine type",
          "description": "Must-try dish recommendation",
          "priceRange": "₹₹"
        },
        {
          "mealType": "Dinner",
          "name": "Restaurant / Cafe Name",
          "cuisine": "Cuisine type",
          "description": "Must-try dish recommendation",
          "priceRange": "₹₹₹"
        }
      ],
      "estimatedDailyCost": 2500
    }
  ],
  "packingList": [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4"
  ],
  "localTips": [
    "Insider tip 1 regarding transport or etiquette",
    "Insider tip 2 regarding best time or hidden gems",
    "Insider tip 3 regarding food or savings"
  ]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

        try {
            const response = await axios.post(
                url,
                {
                    contents: [
                        {
                            parts: [{ text: prompt }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 3500,
                        responseMimeType: "application/json",
                    },
                },
                {
                    headers: { "Content-Type": "application/json" },
                    timeout: 25000,
                }
            );

            const candidate = response.data?.candidates?.[0];
            const textResponse = candidate?.content?.parts?.[0]?.text;

            if (!textResponse) {
                throw new Error("Empty response received from Gemini API");
            }

            // Clean any unintentional code blocks if present
            const cleanedText = textResponse.replace(/^```json\s*/i, "").replace(/\s*```$/, "").trim();
            const parsedData = JSON.parse(cleanedText);
            return parsedData;
        } catch (error) {
            logger.error(`Gemini API execution error: ${error.response?.data?.error?.message || error.message}`);
            throw error;
        }
    }
}

module.exports = GeminiAdapter;
