const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
    {
        listing: {
            type: Schema.Types.ObjectId,
            ref: "Listing",
            required: true,
        },
        guest: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        host: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        nights: {
            type: Number,
            required: true,
            min: 1,
        },
        guestsCount: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
        basePrice: {
            type: Number,
            required: true,
            min: 0,
        },
        cleaningFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        serviceFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        taxPrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "confirmed",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "refunded"],
            default: "paid",
        },
        specialRequests: {
            type: String,
            default: "",
        },
        cancellationReason: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

// Compound index for fast checking of overlapping bookings
bookingSchema.index({ listing: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ guest: 1, createdAt: -1 });
bookingSchema.index({ host: 1, createdAt: -1 });

// Helper to check if dates overlap for a given listing
bookingSchema.statics.hasOverlap = async function (listingId, checkIn, checkOut, excludeBookingId = null) {
    const query = {
        listing: listingId,
        status: { $in: ["confirmed", "pending"] },
        $or: [
            { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
        ],
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlap = await this.findOne(query);
    return !!overlap;
};

module.exports = mongoose.model("Booking", bookingSchema);
