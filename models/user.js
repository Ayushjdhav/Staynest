const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["user", "host", "admin"],
        default: "user",
    },
    avatar: {
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200",
        },
        filename: {
            type: String,
            default: "avatar",
        },
    },
    bio: {
        type: String,
        default: "StayNest traveler & explorer.",
    },
    phone: {
        type: String,
        default: "",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    wishlist: [
        {
            type: Schema.Types.ObjectId,
            ref: "Listing",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);