(() => {
    "use strict";

    // Bootstrap Form Validation
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
})();

// Function to initialize carousels on elements
function initImageCarousels(scope = document) {
    scope.querySelectorAll("[data-image-carousel]").forEach((carousel) => {
        if (carousel.dataset.initialized === "true") return;
        carousel.dataset.initialized = "true";

        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const count = carousel.querySelector(".carousel-count");
        if (slides.length < 2) return;
        let activeIndex = 0;
        const show = (index) => {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => slide.classList.toggle("is-active", slideIndex === activeIndex));
            if (count) count.textContent = `${activeIndex + 1} / ${slides.length}`;
        };
        const prevBtn = carousel.querySelector(".carousel-prev");
        const nextBtn = carousel.querySelector(".carousel-next");
        if (prevBtn) {
            prevBtn.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                show(activeIndex - 1);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                show(activeIndex + 1);
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initImageCarousels();
});

// =======================
// GST / Taxes Display Toggle
// =======================
const taxSwitch = document.getElementById("switchCheckDefault");
if (taxSwitch) {
    const savedState = localStorage.getItem("showGST");
    if (savedState === "true") {
        taxSwitch.checked = true;
    }

    const updateTaxDisplay = () => {
        document.querySelectorAll(".tax-info").forEach((info) => {
            info.style.display = taxSwitch.checked ? "inline" : "none";
        });
    };

    updateTaxDisplay();

    taxSwitch.addEventListener("change", () => {
        localStorage.setItem("showGST", taxSwitch.checked);
        updateTaxDisplay();
    });
}

// =======================
// Category Filter Scroll
// =======================
const filterItems = document.querySelectorAll(".filter-item");
if (filterItems.length > 0) {
    filterItems.forEach((filter) => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.category;
            const url = new URL(window.location);
            if (category === "all") {
                url.searchParams.delete("category");
            } else {
                url.searchParams.set("category", category);
            }
            url.searchParams.set("page", "1");
            window.location.href = url.toString();
        });
    });
}

// ==========================
// ASYNC "LOAD MORE" HANDLER
// ==========================
const loadMoreBtn = document.getElementById("btn-load-more");
const listingsGrid = document.getElementById("staynest-listings-grid");
const skeletonsContainer = document.getElementById("loading-skeletons");
const loadMoreSection = document.getElementById("load-more-section");

if (loadMoreBtn && listingsGrid) {
    loadMoreBtn.addEventListener("click", async () => {
        let currentPage = parseInt(loadMoreBtn.dataset.currentPage, 10) || 1;
        const totalPages = parseInt(loadMoreBtn.dataset.totalPages, 10) || 1;
        const nextPage = currentPage + 1;

        if (nextPage > totalPages) {
            loadMoreSection.innerHTML = `
                <div class="no-more-stays-banner">
                    <i class="fa-solid fa-circle-check text-primary me-2"></i>
                    <span>No more stays available.</span>
                </div>`;
            return;
        }

        // Show skeletons & disable button
        loadMoreBtn.disabled = true;
        loadMoreBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Loading stays...';
        if (skeletonsContainer) skeletonsContainer.style.display = "flex";

        try {
            const params = new URLSearchParams({
                format: "json",
                page: nextPage,
            });

            if (loadMoreBtn.dataset.search) params.set("search", loadMoreBtn.dataset.search);
            if (loadMoreBtn.dataset.category && loadMoreBtn.dataset.category !== "all") params.set("category", loadMoreBtn.dataset.category);
            if (loadMoreBtn.dataset.propertyType && loadMoreBtn.dataset.propertyType !== "all") params.set("propertyType", loadMoreBtn.dataset.propertyType);
            if (loadMoreBtn.dataset.minPrice) params.set("minPrice", loadMoreBtn.dataset.minPrice);
            if (loadMoreBtn.dataset.maxPrice) params.set("maxPrice", loadMoreBtn.dataset.maxPrice);
            if (loadMoreBtn.dataset.amenities) params.set("amenities", loadMoreBtn.dataset.amenities);
            if (loadMoreBtn.dataset.sort) params.set("sort", loadMoreBtn.dataset.sort);

            const response = await fetch(`/listings?${params.toString()}`, {
                headers: { "Accept": "application/json", "X-Requested-With": "XMLHttpRequest" }
            });

            if (!response.ok) throw new Error("Failed to load listings");
            const data = await response.json();

            if (data.success && data.listings && data.listings.length > 0) {
                data.listings.forEach((listing) => {
                    const col = document.createElement("div");
                    col.className = "col listing-item-col";
                    col.setAttribute("data-listing-id", listing._id);

                    const defaultImg = "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80";
                    const displayImg = listing.image?.url || (listing.images && listing.images[0]?.url) || defaultImg;
                    const images = listing.images && listing.images.length > 0 ? listing.images.map(i => i.url) : [displayImg];

                    let slidesHtml = "";
                    images.forEach((imgUrl, idx) => {
                        slidesHtml += `
                            <a href="/listings/${listing._id}" class="carousel-slide ${idx === 0 ? 'is-active' : ''}">
                                <img src="${imgUrl}" loading="lazy" onerror="this.onerror=null;this.src='${defaultImg}';" alt="${listing.title}">
                            </a>`;
                    });

                    let controlsHtml = "";
                    if (images.length > 1) {
                        controlsHtml = `
                            <button type="button" class="carousel-control carousel-prev" aria-label="Previous photo"><i class="fa-solid fa-chevron-left"></i></button>
                            <button type="button" class="carousel-control carousel-next" aria-label="Next photo"><i class="fa-solid fa-chevron-right"></i></button>
                            <span class="carousel-count">1 / ${images.length}</span>`;
                    }

                    const formattedPrice = Number(listing.price).toLocaleString("en-IN");
                    const taxPrice = Math.round(listing.price * 1.18).toLocaleString("en-IN");
                    const rating = listing.avgRating > 0 ? listing.avgRating.toFixed(1) : "New";

                    col.innerHTML = `
                        <div class="listing-card h-100 d-flex flex-column">
                            <div class="card-img-wrapper image-carousel" data-image-carousel>
                                ${slidesHtml}
                                ${controlsHtml}
                                <button class="btn-wishlist" data-id="${listing._id}" aria-label="Save to Wishlist">
                                    <i class="fa-regular fa-heart"></i>
                                </button>
                            </div>
                            <a href="/listings/${listing._id}" class="d-flex flex-column flex-grow-1 text-decoration-none">
                                <div class="d-flex justify-content-between align-items-start mt-2">
                                    <div class="listing-title" title="${listing.title}">${listing.title}</div>
                                    <div class="small fw-bold d-flex align-items-center gap-1 ms-1 text-dark">
                                        <i class="fa-solid fa-star text-warning" style="font-size: 0.8rem;"></i>
                                        <span>${rating}</span>
                                    </div>
                                </div>
                                <div class="listing-subtitle">
                                    <i class="fa-solid fa-location-dot me-1 text-muted" style="font-size: 0.75rem;"></i>${listing.location}, ${listing.country}
                                </div>
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <span class="verified-badge"><i class="fa-solid fa-circle-check"></i> Verified</span>
                                    <span class="small text-muted text-capitalize">• ${listing.propertyType || 'stay'}</span>
                                </div>
                                <div class="listing-price-tag mt-auto">
                                    <strong>₹ ${formattedPrice}</strong>
                                    <span class="text-muted small"> / night</span>
                                    <span class="tax-info" style="display: ${taxSwitch && taxSwitch.checked ? 'inline' : 'none'};"> (₹ ${taxPrice} incl. taxes)</span>
                                </div>
                            </a>
                        </div>`;

                    listingsGrid.appendChild(col);
                });

                // Re-initialize carousels & wishlist
                initImageCarousels(listingsGrid);
                if (window.initWishlistButtons) window.initWishlistButtons();

                // Update page metadata on button
                loadMoreBtn.dataset.currentPage = nextPage;

                if (nextPage >= data.totalPages) {
                    loadMoreSection.innerHTML = `
                        <div class="no-more-stays-banner">
                            <i class="fa-solid fa-circle-check text-primary me-2"></i>
                            <span>No more stays available.</span>
                        </div>`;
                } else {
                    loadMoreBtn.disabled = false;
                    loadMoreBtn.innerHTML = '<i class="fa-solid fa-arrow-down"></i> <span>Load More Stays</span>';
                }
            } else {
                loadMoreSection.innerHTML = `
                    <div class="no-more-stays-banner">
                        <i class="fa-solid fa-circle-check text-primary me-2"></i>
                        <span>No more stays available.</span>
                    </div>`;
            }
        } catch (err) {
            console.error("Load more error:", err);
            loadMoreBtn.disabled = false;
            loadMoreBtn.innerHTML = '<i class="fa-solid fa-arrow-down"></i> <span>Try Again</span>';
        } finally {
            if (skeletonsContainer) skeletonsContainer.style.display = "none";
        }
    });
}

// ==========================
// DARK MODE TOGGLE
// ==========================
const themeBtn = document.getElementById("theme-toggle");
if (themeBtn) {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const isDark = document.body.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}
