const Listing = require("../models/listing");
const Booking = require("../models/booking");
const mongoose = require("mongoose");
const ExpressError = require("../utils/ExpressError");
const axios = require("axios");
const cache = require("../utils/cache");
const logger = require("../utils/logger");
const { cloudinary } = require("../cloudConfig");
const { isCloudinaryAsset } = require("../utils/images");
const { activeListingFilter } = require("../utils/listingQueries");

function uploadedImages(req) {
    if (req.file) return [req.file];
    return Object.values(req.files || {}).flat();
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseTripDates(checkIn, checkOut) {
    if (!checkIn || !checkOut) return { checkIn: null, checkOut: null, nights: 0 };
    const start = new Date(`${checkIn}T00:00:00.000Z`);
    const end = new Date(`${checkOut}T00:00:00.000Z`);
    const nights = Math.round((end - start) / 86400000);
    if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || nights < 1) {
        return { checkIn: null, checkOut: null, nights: 0, error: "Choose a valid check-in and check-out date." };
    }
    return { checkIn: start, checkOut: end, nights };
}

async function removeManagedListingImages(images) {
    await Promise.all(
        images
            .filter((image) => image && isCloudinaryAsset(image.filename))
            .map((image) => cloudinary.uploader.destroy(image.filename, { invalidate: true }))
    );
}

// INDEX: Search, Filter, Sort & Paginate
module.exports.index = async (req, res) => {
    const {
        search,
        category,
        propertyType,
        roomType,
        minPrice,
        maxPrice,
        amenities,
        guests,
        bedrooms,
        checkIn: checkInInput,
        checkOut: checkOutInput,
        sort = "newest",
        page = 1,
        limit = 12,
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 12, 1), 50);

    const query = { ...activeListingFilter };
    const trip = parseTripDates(checkInInput, checkOutInput);

    // Text & location search
    if (search && search.trim()) {
        const searchRegex = new RegExp(escapeRegex(search.trim().slice(0, 80)), "i");
        query.$and = [
            { ...activeListingFilter },
            {
                $or: [
                    { title: searchRegex },
                    { location: searchRegex },
                    { country: searchRegex },
                    { description: searchRegex },
                ],
            },
        ];
        delete query.$or;
    }

    // Category filter
    if (category && category !== "all") {
        query.category = category;
    }

    // Property & Room Types
    if (propertyType && propertyType !== "all") {
        query.propertyType = propertyType;
    }
    if (roomType && roomType !== "all") {
        query.roomType = roomType;
    }

    // Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Capacity
    if (guests) {
        query.maxGuests = { $gte: Number(guests) };
    }
    if (bedrooms) {
        query.bedrooms = { $gte: Number(bedrooms) };
    }

    if (trip.checkIn && trip.checkOut) {
        const unavailableListingIds = await Booking.distinct("listing", {
            status: { $in: ["confirmed", "pending"] },
            checkIn: { $lt: trip.checkOut },
            checkOut: { $gt: trip.checkIn },
        });
        if (unavailableListingIds.length > 0) query._id = { $nin: unavailableListingIds };
    }

    // Amenities (all requested amenities must be present)
    if (amenities) {
        const amenitiesList = Array.isArray(amenities)
            ? amenities
            : amenities.split(",").map((a) => a.trim());
        if (amenitiesList.length > 0) {
            query.amenities = { $all: amenitiesList };
        }
    }

    // Sorting
    const sortOptions = {};
    if (sort === "price_asc") sortOptions.price = 1;
    else if (sort === "price_desc") sortOptions.price = -1;
    else if (sort === "rating_desc") sortOptions.avgRating = -1;
    else if (sort === "popular") sortOptions.reviewCount = -1;
    else sortOptions.createdAt = -1; // Default: newest

    const totalListings = await Listing.countDocuments(query);
    const totalPages = Math.ceil(totalListings / pageLimit) || 1;
    const skip = (currentPage - 1) * pageLimit;

    const allListings = await Listing.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageLimit)
        .populate("owner", "username");

    // Fetch user wishlist IDs if logged in
    let userWishlist = [];
    if (req.user && req.user.wishlist) {
        userWishlist = req.user.wishlist.map((id) => id.toString());
    }

    if (req.xhr || req.query.format === "json") {
        return res.json({
            success: true,
            totalListings,
            totalPages,
            currentPage,
            listings: allListings,
        });
    }

    res.render("listings/index.ejs", {
        allListings,
        search: search || "",
        category: category || "all",
        propertyType: propertyType || "all",
        roomType: roomType || "all",
        minPrice: minPrice || "",
        maxPrice: maxPrice || "",
        amenities: amenities || "",
        guests: guests || "",
        bedrooms: bedrooms || "",
        checkIn: checkInInput || "",
        checkOut: checkOutInput || "",
        tripNights: trip.nights,
        searchMessage: trip.error || "",
        sort,
        currentPage,
        totalPages,
        totalListings,
        userWishlist,
    });
};

// MAP DATA (GeoJSON for interactive map view)
module.exports.mapData = async (req, res) => {
    try {
        const listings = await Listing.find(activeListingFilter).select(
            "title price location country geometry image images category avgRating reviewCount"
        );

        const geoJson = {
            type: "FeatureCollection",
            features: listings.map((l) => ({
                type: "Feature",
                geometry: l.geometry,
                properties: {
                    id: l._id,
                    title: l.title,
                    price: l.price,
                    location: l.location,
                    country: l.country,
                    image: l.displayImage,
                    category: l.category,
                    avgRating: l.avgRating,
                    reviewCount: l.reviewCount,
                },
            })),
        };

        res.json(geoJson);
    } catch (err) {
        logger.error(`Error loading map data: ${err.message}`);
        res.status(500).json({ error: "Failed to load map data" });
    }
};

// NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// SHOW
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Invalid Listing ID");
    }

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: "username avatar createdAt",
            },
        })
        .populate("owner", "username email avatar bio isVerified role");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    // Check if listing is in user wishlist
    let isWishlisted = false;
    if (req.user && req.user.wishlist) {
        isWishlisted = req.user.wishlist.some((wId) => wId.toString() === listing._id.toString());
    }

    res.render("listings/show.ejs", {
        listing,
        geoApiKey: process.env.GEOAPIFY_API_KEY,
        isWishlisted,
    });
};

// EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Listing not found");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.displayImage;
    if (originalImageUrl.includes("/upload")) {
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    }

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// CREATE
module.exports.createListing = async (req, res) => {
    const listingData = { ...req.body.listing };

    // Normalize legacy one-image uploads and the multi-image gallery to the same model.
    const uploads = uploadedImages(req);
    if (uploads.length > 0) {
        listingData.image = {
            url: uploads[0].path,
            filename: uploads[0].filename,
        };
        listingData.images = uploads.map((file, index) => ({
            url: file.path,
            filename: file.filename,
            isCover: index === 0,
        }));
    }

    // Normalize amenities
    if (!listingData.amenities) {
        listingData.amenities = [];
    } else if (typeof listingData.amenities === "string") {
        listingData.amenities = [listingData.amenities];
    }

    // Geocode address
    const address = `${listingData.location}, ${listingData.country}`;
    let coordinates = [73.8567, 18.5204]; // Default fallback coordinates

    try {
        if (process.env.GEOAPIFY_API_KEY) {
            const response = await axios.get("https://api.geoapify.com/v1/geocode/search", {
                params: {
                    text: address,
                    apiKey: process.env.GEOAPIFY_API_KEY,
                },
                timeout: 5000,
            });
            const feature = response.data?.features?.[0];
            if (feature?.geometry?.coordinates) {
                coordinates = feature.geometry.coordinates;
            }
        }
    } catch (err) {
        logger.warn(`Geocoding warning: ${err.message}. Using fallback coordinates.`);
    }

    listingData.geometry = {
        type: "Point",
        coordinates,
    };

    listingData.owner = req.user._id;

    const newListing = new Listing(listingData);
    await newListing.save();

    await cache.del("listings:*");
    req.flash("success", "✨ New Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
};

// UPDATE
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Invalid Listing ID");
    }

    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing not found");

    const previousImages = [listing.image, ...(listing.images || [])];
    
    // Normalize amenities if form submitted
    if (!req.body.listing.amenities) {
        req.body.listing.amenities = [];
    } else if (typeof req.body.listing.amenities === "string") {
        req.body.listing.amenities = [req.body.listing.amenities];
    }

    Object.assign(listing, req.body.listing);
    const uploads = uploadedImages(req);
    if (uploads.length > 0) {
        listing.image = { url: uploads[0].path, filename: uploads[0].filename };
        listing.images = uploads.map((file, index) => ({
            url: file.path,
            filename: file.filename,
            isCover: index === 0,
        }));
    }
    await listing.save();

    if (uploads.length > 0) {
        removeManagedListingImages(previousImages).catch((error) =>
            logger.warn(`Could not remove replaced listing images: ${error.message}`)
        );
    }

    await cache.del("listings:*");
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};

// DESTROY
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ExpressError(404, "Invalid Listing ID");
    }

    const listing = await Listing.findByIdAndDelete(id);
    if (listing) {
        removeManagedListingImages([listing.image, ...(listing.images || [])]).catch((error) =>
            logger.warn(`Could not remove deleted listing images: ${error.message}`)
        );
    }
    await cache.del("listings:*");

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
