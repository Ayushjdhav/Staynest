const swaggerJSDoc = require("swagger-jsdoc");

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "StayNest AI Travel Marketplace API",
        version: "2.0.0",
        description:
            "Production-grade RESTful API documentation for StayNest - Find your next stay, with confidence. An AI-powered accommodation platform featuring properties discovery, dynamic availability/bookings, host management, and AI trip planning.",
        contact: {
            name: "StayNest Engineering Team",
        },
    },
    servers: [
        {
            url: "http://localhost:8080",
            description: "Development Server",
        },
    ],
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "connect.sid",
            },
        },
        schemas: {
            Listing: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    title: { type: "string", example: "Luxury Beach Villa" },
                    description: { type: "string", example: "Breathtaking oceanfront villa with private pool" },
                    price: { type: "number", example: 14500 },
                    location: { type: "string", example: "Goa" },
                    country: { type: "string", example: "India" },
                    category: { type: "string", example: "beach" },
                    propertyType: { type: "string", example: "villa" },
                    roomType: { type: "string", example: "entire_place" },
                    amenities: { type: "array", items: { type: "string" }, example: ["wifi", "pool", "ac"] },
                    maxGuests: { type: "number", example: 6 },
                    avgRating: { type: "number", example: 4.9 },
                    reviewCount: { type: "number", example: 28 },
                },
            },
            Booking: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    listing: { type: "string" },
                    checkIn: { type: "string", format: "date" },
                    checkOut: { type: "string", format: "date" },
                    nights: { type: "number", example: 3 },
                    totalPrice: { type: "number", example: 48500 },
                    status: { type: "string", example: "confirmed" },
                },
            },
            Itinerary: {
                type: "object",
                properties: {
                    id: { type: "string" },
                    destination: { type: "string", example: "Goa" },
                    days: { type: "number", example: 3 },
                    title: { type: "string" },
                    summary: { type: "string" },
                    dailyPlans: { type: "array", items: { type: "object" } },
                    recommendedListings: { type: "array", items: { type: "object" } },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ["./routes/api/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
