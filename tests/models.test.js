const mongoose = require("mongoose");
const Booking = require("../models/booking");

describe("Models Unit Test Suite", () => {
    describe("Booking Model Statics & Validation", () => {
        it("should define hasOverlap static function on Booking model", () => {
            expect(typeof Booking.hasOverlap).toBe("function");
        });

        it("should validate booking schema structure and defaults", () => {
            const bookingData = {
                listing: new mongoose.Types.ObjectId(),
                guest: new mongoose.Types.ObjectId(),
                host: new mongoose.Types.ObjectId(),
                checkIn: new Date("2026-10-01"),
                checkOut: new Date("2026-10-05"),
                nights: 4,
                guestsCount: 2,
                basePrice: 40000,
                cleaningFee: 1000,
                serviceFee: 2000,
                taxPrice: 5000,
                totalPrice: 48000,
            };

            const bookingDoc = new Booking(bookingData);
            const err = bookingDoc.validateSync();
            expect(err).toBeUndefined();
            expect(bookingDoc.status).toBe("confirmed");
            expect(bookingDoc.paymentStatus).toBe("paid");
        });

        it("should fail validation if required fields are missing", () => {
            const invalidDoc = new Booking({
                nights: 0,
            });
            const err = invalidDoc.validateSync();
            expect(err).toBeDefined();
            expect(err.errors.listing).toBeDefined();
            expect(err.errors.guest).toBeDefined();
            expect(err.errors.host).toBeDefined();
        });
    });
});
