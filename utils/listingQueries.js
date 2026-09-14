// Existing listings created before the marketplace lifecycle field was added are live by default.
// Keep this compatibility filter until every environment has completed the one-time backfill.
const activeListingFilter = {
    $or: [{ isActive: true }, { isActive: { $exists: false } }],
};

module.exports = { activeListingFilter };
