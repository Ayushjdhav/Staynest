/**
 * Abstract AI Provider Interface
 * All AI adapters (Gemini, OpenAI, Mock, etc.) must implement this interface.
 */
class AIProviderInterface {
    /**
     * Generate structured travel itinerary and recommend candidate listings
     * @param {Object} params
     * @param {string} params.destination - Target travel destination
     * @param {number} params.days - Number of days (1-14)
     * @param {string} params.budgetTier - Budget tier (budget, moderate, luxury)
     * @param {number} params.budgetAmount - Specific numeric budget if provided
     * @param {string[]} params.interests - Array of user interests/vibes
     * @param {number} params.guests - Number of travelers
     * @param {Array} params.candidateListings - Real StayNest listings retrieved from MongoDB
     * @returns {Promise<Object>} Structured itinerary response
     */
    async generateItinerary(params) {
        throw new Error("generateItinerary method must be implemented by the provider adapter");
    }
}

module.exports = AIProviderInterface;
