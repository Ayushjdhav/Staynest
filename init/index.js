const mongoose = require("mongoose");
const stayNestListings = require("./stayNestData.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "../.env"),
});

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/staynest";

const sampleReviewComments = [
    "An extraordinary stay! Spotlessly clean, thoughtful amenities, and seamless check-in. The photos don't do justice to how magnificent the space feels.",
    "Outstanding hospitality from our StayNest host! The location was perfect, wifi was fast, and the local recommendations made our trip unforgettable.",
    "Breathtaking scenery and peaceful ambiance. Everything described in the listing was 100% accurate. Highly recommend!",
    "Five-star experience through and through. The bed was incredibly comfortable and the kitchen was fully equipped for home cooking.",
    "A true gem. Quiet, serene, beautifully designed, and crystal clean. Will definitely book again on our next trip!"
];

async function seedDatabase() {
    try {
        console.log("⏳ Connecting to MongoDB Atlas...");
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB Atlas");

        // 1. Ensure Verified Host User exists
        let hostUser = await User.findOne({ username: "staynest_host" });
        if (!hostUser) {
            hostUser = new User({
                username: "staynest_host",
                email: "host@staynest.com",
                role: "host",
                isVerified: true,
                bio: "Experienced StayNest Superhost dedicated to providing exceptional, comfortable stays worldwide.",
                avatar: {
                    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                    filename: "staynest_host_avatar",
                },
            });
            await User.register(hostUser, "StayNestHost123!");
            console.log("✨ Created verified host: staynest_host");
        }

        // 2. Ensure Sample Reviewers exist
        const reviewerProfiles = [
            { username: "clara_globe", email: "clara@staynest.com", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
            { username: "marcus_design", email: "marcus@staynest.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
            { username: "priya_travels", email: "priya@staynest.com", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
            { username: "kenji_tokyo", email: "kenji@staynest.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
        ];

        const reviewerUsers = [];
        for (const r of reviewerProfiles) {
            let u = await User.findOne({ username: r.username });
            if (!u) {
                u = new User({
                    username: r.username,
                    email: r.email,
                    role: "user",
                    avatar: { url: r.avatar, filename: "reviewer_avatar" },
                    bio: "StayNest travel explorer & architecture enthusiast.",
                });
                await User.register(u, "StayNestUser123!");
            }
            reviewerUsers.push(u);
        }

        // 3. Clear existing listings & reviews
        console.log("🧹 Clearing old dummy listings and reviews...");
        await Listing.deleteMany({});
        await Review.deleteMany({});

        // 4. Create listings with authentic reviews
        console.log(`🚀 Seeding ${stayNestListings.length} verified StayNest listings...`);
        const seededListings = [];

        for (let i = 0; i < stayNestListings.length; i++) {
            const raw = { ...stayNestListings[i] };
            raw.owner = hostUser._id;
            raw.isActive = true;
            raw.isFeatured = i < 6;

            // Generate 2 to 3 realistic reviews per listing
            const reviewDocs = [];
            const numReviews = 2 + (i % 2);
            let totalRating = 0;

            for (let rIdx = 0; rIdx < numReviews; rIdx++) {
                const reviewer = reviewerUsers[(i + rIdx) % reviewerUsers.length];
                const ratingValue = 5;
                totalRating += ratingValue;

                const review = new Review({
                    comment: sampleReviewComments[(i + rIdx) % sampleReviewComments.length],
                    rating: ratingValue,
                    ratings: {
                        cleanliness: 5,
                        accuracy: 5,
                        checkIn: 5,
                        communication: 5,
                        location: 5,
                        value: 5,
                    },
                    author: reviewer._id,
                    createdAt: new Date(Date.now() - (rIdx * 12 + 3) * 86400000),
                });
                await review.save();
                reviewDocs.push(review._id);
            }

            raw.reviews = reviewDocs;
            raw.reviewCount = reviewDocs.length;
            raw.avgRating = Number((totalRating / reviewDocs.length).toFixed(1));

            seededListings.push(raw);
        }

        await Listing.insertMany(seededListings);
        console.log(`✅ Successfully seeded ${seededListings.length} verified StayNest properties!`);
    } catch (err) {
        console.error("❌ Seeding failed:", err);
    } finally {
        await mongoose.connection.close();
        console.log("🔒 MongoDB connection closed.");
    }
}

seedDatabase();