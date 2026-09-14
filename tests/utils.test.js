const {
    isUsableImageUrl,
    getListingImageUrls,
    getListingDisplayImage,
    isCloudinaryAsset,
    FALLBACK_IMAGE_URL,
} = require("../utils/images");
const cache = require("../utils/cache");
const { activeListingFilter } = require("../utils/listingQueries");
const ExpressError = require("../utils/ExpressError");

describe("Utils Unit Test Suite", () => {
    describe("images.js Utilities", () => {
        it("should accurately validate image URLs", () => {
            expect(isUsableImageUrl("https://res.cloudinary.com/demo/image/upload/sample.jpg")).toBe(true);
            expect(isUsableImageUrl("http://example.com/photo.png")).toBe(true);
            expect(isUsableImageUrl("/images/listing-placeholder.svg")).toBe(true);
            expect(isUsableImageUrl("invalid-url")).toBe(false);
            expect(isUsableImageUrl(null)).toBe(false);
            expect(isUsableImageUrl(undefined)).toBe(false);
            expect(isUsableImageUrl(123)).toBe(false);
        });

        it("should extract unique image URLs from listing", () => {
            const listing = {
                images: [
                    { url: "https://images.unsplash.com/photo-1.jpg" },
                    { url: "https://images.unsplash.com/photo-2.jpg" },
                    { url: "" },
                ],
                image: { url: "https://images.unsplash.com/photo-1.jpg" },
            };

            const urls = getListingImageUrls(listing);
            expect(urls).toEqual([
                "https://images.unsplash.com/photo-1.jpg",
                "https://images.unsplash.com/photo-2.jpg",
            ]);
        });

        it("should return display image or fallback image", () => {
            const validListing = {
                images: [{ url: "https://images.unsplash.com/photo-1.jpg" }],
            };
            expect(getListingDisplayImage(validListing)).toBe("https://images.unsplash.com/photo-1.jpg");

            const emptyListing = { images: [] };
            expect(getListingDisplayImage(emptyListing)).toBe(FALLBACK_IMAGE_URL);
            expect(getListingDisplayImage(null)).toBe(FALLBACK_IMAGE_URL);
        });

        it("should check if asset is a Cloudinary asset", () => {
            expect(isCloudinaryAsset("staynest/listing123")).toBe(true);
            expect(isCloudinaryAsset("wanderlust/photo456")).toBe(true);
            expect(isCloudinaryAsset("otherfolder/pic.png")).toBe(false);
            expect(isCloudinaryAsset(null)).toBe(false);
        });
    });

    describe("listingQueries.js Utilities", () => {
        it("should export correct active listing query filter", () => {
            expect(activeListingFilter).toBeDefined();
            expect(activeListingFilter.$or).toBeDefined();
            expect(activeListingFilter.$or.length).toBe(2);
        });
    });

    describe("ExpressError Class", () => {
        it("should construct error with statusCode and message", () => {
            const err = new ExpressError(404, "Page Not Found");
            expect(err.statusCode).toBe(404);
            expect(err.message).toBe("Page Not Found");
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("cache.js Operations", () => {
        it("should perform cache store, retrieval, and removal", async () => {
            await cache.set("unit_test_key", { data: "test_value" }, 10);
            const data = await cache.get("unit_test_key");
            expect(data).toEqual({ data: "test_value" });

            await cache.del("unit_test_key");
            const deleted = await cache.get("unit_test_key");
            expect(deleted).toBeNull();
        });
    });
});
