const aiPlannerService = require("../services/aiPlannerService");
const Itinerary = require("../models/itinerary");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

// Render AI Wizard
module.exports.renderWizard = (req, res) => {
    res.render("planner/new.ejs");
};

// Generate AI Itinerary
module.exports.generateItinerary = async (req, res) => {
    const { destination, days = 3, budgetTier = "moderate", budgetAmount = 0, interests, guests = 2 } = req.body;

    let parsedInterests = interests;
    if (typeof interests === "string") {
        parsedInterests = interests.split(",").map((i) => i.trim()).filter(Boolean);
    }
    if (!parsedInterests || parsedInterests.length === 0) {
        parsedInterests = ["Sightseeing", "Food & Dining"];
    }

    const userId = req.user ? req.user._id : null;

    const itinerary = await aiPlannerService.planTrip({
        userId,
        destination,
        days,
        budgetTier,
        budgetAmount,
        interests: parsedInterests,
        guests,
    });

    if (req.xhr || req.headers.accept?.indexOf("json") > -1) {
        return res.json({ success: true, itinerary });
    }

    req.flash("success", `✨ Your personalized itinerary for ${destination} is ready!`);
    res.redirect(`/planner/${itinerary._id}`);
};

// Show Itinerary Detail
module.exports.showItinerary = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Invalid Itinerary ID");
    }

    const itinerary = await Itinerary.findById(id).populate({
        path: "recommendedListings.listing",
        populate: { path: "owner", select: "username avatar" },
    });

    if (!itinerary) {
        req.flash("error", "Itinerary not found!");
        return res.redirect("/planner");
    }

    res.render("planner/show.ejs", { itinerary });
};

// List User Saved AI Trips
module.exports.myTrips = async (req, res) => {
    const itineraries = await Itinerary.find({ user: req.user._id })
        .populate("recommendedListings.listing", "title location country image price")
        .sort({ createdAt: -1 });

    res.render("planner/index.ejs", { itineraries });
};
