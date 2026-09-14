const FALLBACK_IMAGE_URL = "/images/listing-placeholder.svg";

function isUsableImageUrl(value) {
    return typeof value === "string" && /^(https?:\/\/|\/)/i.test(value.trim());
}

function getListingImageUrls(listing) {
    const galleryUrls = (Array.isArray(listing?.images) ? listing.images : [])
        .map((image) => image?.url)
        .filter(isUsableImageUrl);
    const legacyUrl = listing?.image?.url;

    return [...new Set([...galleryUrls, legacyUrl].filter(isUsableImageUrl))];
}

function getListingDisplayImage(listing) {
    return getListingImageUrls(listing)[0] || FALLBACK_IMAGE_URL;
}

function isCloudinaryAsset(filename) {
    return typeof filename === "string" && (filename.startsWith("staynest/") || filename.startsWith("wanderlust/"));
}

module.exports = { FALLBACK_IMAGE_URL, getListingDisplayImage, getListingImageUrls, isCloudinaryAsset };
