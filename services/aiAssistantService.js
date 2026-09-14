const Listing = require("../models/listing");
const logger = require("../utils/logger");
const { GoogleGenAI } = require("@google/genai");

class AIAssistantService {
    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY;
        this.geminiClient = this.apiKey ? new GoogleGenAI({ apiKey: this.apiKey }) : null;
    }

    /**
     * Parse query to extract search heuristics from natural language
     */
    extractQueryCriteria(message) {
        const text = message.toLowerCase();
        const criteria = {
            destination: null,
            maxPrice: null,
            minGuests: null,
            category: null,
            amenities: [],
        };

        // Common destinations
        const destinations = [
            "goa", "manali", "jaipur", "udaipur", "alleppey", "kerala",
            "santorini", "zermatt", "switzerland", "ubud", "bali",
            "tokyo", "japan", "paris", "positano", "amalfi", "tuscany",
            "lapland", "finland", "new york", "munnar", "scotland", "inverness",
            "kyoto", "gion", "dharamshala", "maldives", "rishikesh"
        ];

        for (const dest of destinations) {
            if (text.includes(dest)) {
                criteria.destination = dest;
                break;
            }
        }

        // Budget / Price detection (e.g. "under 10000", "below 15k", "under ₹8,000")
        const priceMatch = text.match(/(?:under|below|less than|budget of|max(?:imum)?)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*(?:\s*k)?)/i);
        if (priceMatch) {
            let val = priceMatch[1].replace(/,/g, "").trim().toLowerCase();
            if (val.endsWith("k")) {
                criteria.maxPrice = parseFloat(val) * 1000;
            } else {
                criteria.maxPrice = parseFloat(val);
            }
        }

        // Guests detection (e.g. "for 4 guests", "4 people", "family of 5")
        const guestMatch = text.match(/(\d+)\s*(?:guests?|people|persons|adults)/i);
        if (guestMatch) {
            criteria.minGuests = parseInt(guestMatch[1], 10);
        }

        // Amenities
        const amenityKeywords = {
            pool: ["pool", "swimming pool", "private pool"],
            wifi: ["wifi", "wi-fi", "internet", "high speed internet"],
            ac: ["ac", "air condition", "air conditioning"],
            kitchen: ["kitchen", "cooking", "stove"],
            hot_tub: ["hot tub", "jacuzzi"],
            beach_access: ["beach", "beachfront", "sea view", "ocean view", "beach access"],
            dedicated_workspace: ["workspace", "desk", "work from home", "remote work"],
            free_parking: ["parking", "car parking", "garage"],
            pet_friendly: ["pet", "pets", "dog", "cat"],
        };

        for (const [amenityKey, keywords] of Object.entries(amenityKeywords)) {
            if (keywords.some((kw) => new RegExp(`\\b${kw}\\b`, "i").test(text))) {
                criteria.amenities.push(amenityKey);
            }
        }

        // Categories
        const categories = ["villas", "beach", "mountains", "castles", "pools", "farms", "arctic", "forest", "luxury", "rooms"];
        for (const cat of categories) {
            if (text.includes(cat)) {
                criteria.category = cat;
                break;
            }
        }

        return criteria;
    }

    /**
     * Retrieve grounded database records matching user query or listing context
     */
    async retrieveListingsForContext(message, listingId = null) {
        try {
            // 1. If asking about a specific listing on its page
            if (listingId) {
                const listing = await Listing.findById(listingId)
                    .populate("owner", "username email isVerified")
                    .populate({ path: "reviews", populate: { path: "author", select: "username" } })
                    .lean();
                if (listing) {
                    return { currentListing: listing, candidateListings: [listing] };
                }
            }

            // 2. Search listings based on extracted criteria
            const criteria = this.extractQueryCriteria(message);
            const query = { isActive: true };

            if (criteria.destination) {
                const regex = new RegExp(criteria.destination, "i");
                query.$or = [{ location: regex }, { country: regex }, { title: regex }, { description: regex }];
            }

            if (criteria.maxPrice) {
                query.price = { $lte: criteria.maxPrice };
            }

            if (criteria.minGuests) {
                query.maxGuests = { $gte: criteria.minGuests };
            }

            if (criteria.category) {
                query.category = criteria.category;
            }

            if (criteria.amenities.length > 0) {
                query.amenities = { $in: criteria.amenities };
            }

            let candidateListings = await Listing.find(query)
                .sort({ avgRating: -1, price: 1 })
                .limit(5)
                .populate("owner", "username")
                .lean();

            // Fallback: If strict query gave no results, relax destination or category to provide top stays
            if (!candidateListings || candidateListings.length === 0) {
                candidateListings = await Listing.find({ isActive: true })
                    .sort({ avgRating: -1, reviewCount: -1 })
                    .limit(4)
                    .populate("owner", "username")
                    .lean();
            }

            return { currentListing: null, candidateListings };
        } catch (error) {
            logger.error(`Error retrieving listings for StayNest AI assistant: ${error.message}`);
            return { currentListing: null, candidateListings: [] };
        }
    }

    /**
     * Smart Deterministic Grounded Engine (Used directly or as infallible fallback)
     */
    generateDeterministicResponse(message, currentListing, candidateListings) {
        const text = message.toLowerCase();

        // 1. Context: User is on a specific listing details page
        if (currentListing) {
            const l = currentListing;
            const priceFormatted = `₹${l.price.toLocaleString("en-IN")}`;

            if (text.includes("price") || text.includes("cost") || text.includes("how much") || text.includes("fee")) {
                const cleaning = l.cleaningFee ? ` plus a ₹${l.cleaningFee.toLocaleString("en-IN")} cleaning fee` : "";
                return {
                    reply: `**${l.title}** is currently priced at **${priceFormatted} per night**${cleaning} (before taxes). It accommodates up to **${l.maxGuests || 2} guests** across **${l.bedrooms || 1} bedroom(s)**.`,
                    recommendations: [l],
                };
            }

            if (text.includes("amenit") || text.includes("facility") || text.includes("offer") || text.includes("features")) {
                const amenitiesList = (l.amenities && l.amenities.length > 0)
                    ? l.amenities.map(a => a.replace(/_/g, " ")).join(", ")
                    : "Data not available.";
                return {
                    reply: `Here are the verified amenities available at **${l.title}** in ${l.location}:\n\n• **Amenities**: ${amenitiesList}\n• **Cancellation Policy**: ${l.cancellationPolicy ? l.cancellationPolicy.toUpperCase() : "Data not available."}\n• **Rating**: ${l.avgRating > 0 ? l.avgRating + " ★ (" + l.reviewCount + " reviews)" : "New"}\n\nAny amenities not listed above are: *Data not available.*`,
                    recommendations: [l],
                };
            }

            // Check specific amenity with word boundaries
            const specificAmenities = ["wifi", "pool", "ac", "kitchen", "hot tub", "beach", "parking", "workspace", "pet"];
            for (const am of specificAmenities) {
                const regex = new RegExp(`\\b${am.replace(/\s+/g, "\\s*")}\\b`, "i");
                if (regex.test(text)) {
                    const normalized = am.replace(/\s+/g, "_");
                    const hasAmenity = (l.amenities || []).some(a => a.includes(normalized) || a.includes(am));
                    if (hasAmenity) {
                        return {
                            reply: `**Yes**, ${l.title} includes **${am.toUpperCase()}**. It is verified in the property record.`,
                            recommendations: [l],
                        };
                    } else {
                        return {
                            reply: `**No**, ${am.toUpperCase()} is not listed in the verified amenities for **${l.title}**.\n\n*Note*: If this is not specified in the property record, this amenity is: **Data not available.**`,
                            recommendations: [l],
                        };
                    }
                }
            }

            if (text.includes("host") || text.includes("owner") || text.includes("check in") || text.includes("rules")) {
                const hostName = l.owner ? l.owner.username : "Verified StayNest Host";
                const rules = (l.houseRules && l.houseRules.length > 0) ? l.houseRules.join(" • ") : "Standard check-in after 2:00 PM.";
                return {
                    reply: `**${l.title}** is hosted by **${hostName}**.\n\n• **Location**: ${l.location}, ${l.country}\n• **House Rules**: ${rules}\n• **Cancellation**: ${l.cancellationPolicy || "Flexible"}`,
                    recommendations: [l],
                };
            }

            return {
                reply: `**${l.title}** is located in **${l.location}, ${l.country}**.\n\n• **Price**: ${priceFormatted} / night\n• **Capacity**: ${l.maxGuests} guests, ${l.bedrooms} bedroom(s), ${l.bathrooms} bath(s)\n• **Verified Rating**: ${l.avgRating > 0 ? l.avgRating + " ★ (" + l.reviewCount + " reviews)" : "New"}\n• **Top Amenities**: ${(l.amenities || []).slice(0, 5).join(", ") || "Data not available."}\n\nAsk me about pricing, specific amenities, or house rules!`,
                recommendations: [l],
            };
        }

        // 2. General Query across catalog
        if (!candidateListings || candidateListings.length === 0) {
            return {
                reply: "I searched our live database, but no stays matched your exact criteria. **Data not available** for this combination. Please try searching for destinations like Goa, Manali, Jaipur, Tokyo, or Santorini!",
                recommendations: [],
            };
        }

        let reply = `Here are real, verified stays from our database matching your inquiry:\n\n`;
        candidateListings.forEach((stay, index) => {
            const amenitiesStr = (stay.amenities && stay.amenities.length > 0)
                ? stay.amenities.slice(0, 4).map(a => a.replace(/_/g, " ")).join(", ")
                : "Data not available";
            reply += `${index + 1}. [**${stay.title}**](/listings/${stay._id})\n`;
            reply += `   • **Location**: ${stay.location}, ${stay.country}\n`;
            reply += `   • **Price**: ₹${stay.price.toLocaleString("en-IN")} / night\n`;
            reply += `   • **Rating**: ${stay.avgRating > 0 ? stay.avgRating + " ★ (" + stay.reviewCount + " reviews)" : "New"}\n`;
            reply += `   • **Capacity**: ${stay.maxGuests || 2} guests • ${stay.bedrooms || 1} bed(s)\n`;
            reply += `   • **Verified Amenities**: ${amenitiesStr}\n\n`;
        });
        reply += `*Note: All prices, locations, and amenities are sourced strictly from live StayNest property records. If any detail is not specified, it is: Data not available.*`;

        return {
            reply,
            recommendations: candidateListings,
        };
    }

    /**
     * Primary Assistant Query Method (Grounded in Database)
     */
    async ask({ message, listingId = null, conversationHistory = [] }) {
        if (!message || typeof message !== "string" || !message.trim()) {
            return {
                success: false,
                reply: "Please provide a question or search inquiry about stays or destinations.",
                recommendations: [],
            };
        }

        const trimmedMessage = message.trim().slice(0, 300);

        // 1. Fetch live MongoDB listing records
        const { currentListing, candidateListings } = await this.retrieveListingsForContext(trimmedMessage, listingId);

        // 2. Prepare structured context for grounding
        const dbContext = candidateListings.map((l) => ({
            id: l._id.toString(),
            title: l.title,
            description: l.description ? l.description.slice(0, 200) : "",
            location: l.location,
            country: l.country,
            price_per_night_inr: l.price,
            cleaning_fee_inr: l.cleaningFee || 0,
            max_guests: l.maxGuests,
            bedrooms: l.bedrooms,
            bathrooms: l.bathrooms,
            property_type: l.propertyType,
            room_type: l.roomType,
            cancellation_policy: l.cancellationPolicy,
            amenities: l.amenities || [],
            rating: l.avgRating,
            review_count: l.reviewCount,
            house_rules: l.houseRules || [],
        }));

        // 3. Try Gemini LLM Grounding if API key is configured
        if (this.geminiClient) {
            try {
                const systemInstruction = `You are StayNest AI, an expert travel concierge for the StayNest accommodation platform.
CRITICAL GROUNDING RULES:
1. You MUST answer the user's questions strictly using the REAL LISTING DATA provided below in JSON format.
2. NEVER invent, assume, or fabricate prices, locations, amenities, availability, or property features.
3. If the user asks about an amenity, price, rule, or location not found in the provided data, you MUST explicitly state: "Data not available."
4. When mentioning any listing, cite its EXACT title, price in INR (₹), location, and format links as markdown [Listing Title](/listings/{id}).
5. Keep your response friendly, clear, concise, and formatted with bullet points.`;

                const userPrompt = `USER QUESTION: "${trimmedMessage}"
${currentListing ? `(Context: The user is currently viewing listing ID: ${currentListing._id})` : ""}

AVAILABLE DATABASE LISTINGS (GROUND TRUTH):
${JSON.stringify(dbContext, null, 2)}

Provide your grounded response following the rules above.`;

                const response = await this.geminiClient.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: userPrompt,
                    config: {
                        systemInstruction,
                        temperature: 0.2, // Low temperature for factual precision
                    },
                });

                if (response && response.text) {
                    return {
                        success: true,
                        reply: response.text,
                        recommendations: candidateListings.slice(0, 4),
                    };
                }
            } catch (err) {
                logger.warn(`Gemini AI Assistant generation failed (${err.message}). Falling back to deterministic engine.`);
            }
        }

        // 4. Infallible Grounded Deterministic Engine
        const deterministicResult = this.generateDeterministicResponse(trimmedMessage, currentListing, candidateListings);
        return {
            success: true,
            reply: deterministicResult.reply,
            recommendations: deterministicResult.recommendations.slice(0, 4),
        };
    }
}

module.exports = new AIAssistantService();
