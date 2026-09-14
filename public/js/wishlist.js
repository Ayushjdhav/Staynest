// 1-Click AJAX Wishlist Toggle with Micro-Animations
document.addEventListener("DOMContentLoaded", () => {
    const wishlistBtns = document.querySelectorAll(".btn-wishlist, .btn-wishlist-detail");

    wishlistBtns.forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const listingId = btn.dataset.id;
            if (!listingId) return;

            try {
                const response = await fetch(`/wishlists/toggle/${listingId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });

                if (response.status === 401) {
                    window.location.href = "/login";
                    return;
                }

                const data = await response.json();
                if (data.success) {
                    const icon = btn.querySelector("i");
                    const label = btn.querySelector("span");

                    if (data.isSaved) {
                        btn.classList.add("active");
                        if (icon) {
                            icon.classList.remove("fa-regular");
                            icon.classList.add("fa-solid", "text-danger");
                        }
                        if (label) label.textContent = "Saved";
                    } else {
                        btn.classList.remove("active");
                        if (icon) {
                            icon.classList.remove("fa-solid", "text-danger");
                            icon.classList.add("fa-regular");
                        }
                        if (label) label.textContent = "Save";

                        // If on wishlists page, remove card smoothly
                        const wishlistItem = document.getElementById(`wishlist-item-${listingId}`);
                        if (wishlistItem) {
                            wishlistItem.style.opacity = "0";
                            wishlistItem.style.transform = "scale(0.8)";
                            wishlistItem.style.transition = "all 0.3s ease";
                            setTimeout(() => wishlistItem.remove(), 300);
                        }
                    }
                }
            } catch (err) {
                console.error("Wishlist toggle error:", err);
            }
        });
    });
});
