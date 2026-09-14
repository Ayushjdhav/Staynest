const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { aiLimiter, validatePlannerQuery, isLoggedIn } = require("../middleware");
const plannerController = require("../controllers/planner");

// Planner Wizard Form
router.get("/", plannerController.renderWizard);

// Generate Itinerary
router.post("/generate", aiLimiter, validatePlannerQuery, wrapAsync(plannerController.generateItinerary));

// My Saved AI Trips
router.get("/my-trips", isLoggedIn, wrapAsync(plannerController.myTrips));

// View Single Itinerary
router.get("/:id", wrapAsync(plannerController.showItinerary));

module.exports = router;
