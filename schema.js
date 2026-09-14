const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().trim().min(3).max(100),
        description: Joi.string().required().min(10),
        price: Joi.number().required().min(0),
        location: Joi.string().required().trim(),
        country: Joi.string().required().trim(),
        category: Joi.string().required(),
        propertyType: Joi.string()
            .valid(
                "villa",
                "apartment",
                "cabin",
                "cottage",
                "house",
                "hotel",
                "chalet",
                "mansion",
                "resort",
                "treehouse"
            )
            .default("apartment"),
        roomType: Joi.string()
            .valid("entire_place", "private_room", "shared_room")
            .default("entire_place"),
        amenities: Joi.alternatives()
            .try(Joi.array().items(Joi.string()), Joi.string())
            .optional(),
        bedrooms: Joi.number().min(1).default(1),
        beds: Joi.number().min(1).default(1),
        bathrooms: Joi.number().min(0.5).default(1),
        maxGuests: Joi.number().min(1).default(2),
        cleaningFee: Joi.number().min(0).default(500),
        cancellationPolicy: Joi.string()
            .valid("flexible", "moderate", "strict")
            .default("flexible"),
        image: Joi.object({
            filename: Joi.string().allow("", null),
            url: Joi.string().allow("", null),
        }).optional(),
    }).required(),
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required().trim().min(2),
        ratings: Joi.object({
            cleanliness: Joi.number().min(1).max(5).default(5),
            accuracy: Joi.number().min(1).max(5).default(5),
            checkIn: Joi.number().min(1).max(5).default(5),
            communication: Joi.number().min(1).max(5).default(5),
            location: Joi.number().min(1).max(5).default(5),
            value: Joi.number().min(1).max(5).default(5),
        }).optional(),
    }).required(),
});

module.exports.bookingSchema = Joi.object({
    booking: Joi.object({
        listingId: Joi.string().required(),
        checkIn: Joi.date().iso().required(),
        checkOut: Joi.date().iso().greater(Joi.ref("checkIn")).required(),
        guestsCount: Joi.number().min(1).default(1),
        specialRequests: Joi.string().allow("", null).max(500),
    }).required(),
});

module.exports.plannerQuerySchema = Joi.object({
    destination: Joi.string().required().trim().min(2).max(100),
    days: Joi.number().min(1).max(14).default(3),
    budgetTier: Joi.string().valid("budget", "moderate", "luxury", "flexible").default("moderate"),
    budgetAmount: Joi.number().min(0).optional(),
    interests: Joi.alternatives()
        .try(Joi.array().items(Joi.string()), Joi.string())
        .default(["Sightseeing", "Food"]),
    guests: Joi.number().min(1).max(20).default(2),
});

module.exports.userProfileSchema = Joi.object({
    bio: Joi.string().allow("", null).max(300),
    phone: Joi.string().allow("", null).max(20),
    role: Joi.string().valid("user", "host").optional(),
});
