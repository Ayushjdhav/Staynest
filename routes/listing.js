const express = require("express");
const router = express.Router();
const multer = require("multer");

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isHost, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const bookingsController = require("../controllers/bookings.js");
const { imageUploadOptions } = require("../cloudConfig.js");
const upload = multer(imageUploadOptions);
const listingImagesUpload = upload.fields([
    { name: "listing[images]", maxCount: 5 },
    { name: "listing[image]", maxCount: 5 },
]);

// GeoJSON map data endpoint
router.get("/map-data", wrapAsync(listingController.mapData));

// INDEX & CREATE ROUTES
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        isHost,
        listingImagesUpload,
        validateListing,
        wrapAsync(listingController.createListing)
    );

// NEW ROUTE
router.get("/new", isLoggedIn, isHost, listingController.renderNewForm);

// CHECK AVAILABILITY ROUTE
router.get("/:id/availability", wrapAsync(bookingsController.checkAvailability));

// SHOW, UPDATE & DELETE ROUTES
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isHost,
        isOwner,
        listingImagesUpload,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(isLoggedIn, isHost, isOwner, wrapAsync(listingController.destroyListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isHost, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
