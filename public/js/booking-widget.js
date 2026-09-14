// Dynamic Booking Widget & Live Price Calculator
document.addEventListener("DOMContentLoaded", () => {
    const checkInInput = document.getElementById("booking-check-in");
    const checkOutInput = document.getElementById("booking-check-out");
    const reserveBtn = document.getElementById("btn-reserve");

    const numNightsSpan = document.getElementById("num-nights");
    const basePriceDisplay = document.getElementById("base-price-display");
    const serviceFeeDisplay = document.getElementById("service-fee-display");
    const taxFeeDisplay = document.getElementById("tax-fee-display");
    const totalPriceDisplay = document.getElementById("total-price-display");

    if (!checkInInput || !checkOutInput) return;

    // Set minimum date to today
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const defaultCheckout = new Date(tomorrow);
    defaultCheckout.setDate(defaultCheckout.getDate() + 3);

    const formatDate = (d) => d.toISOString().split("T")[0];

    checkInInput.min = formatDate(today);
    checkInInput.value = formatDate(tomorrow);

    checkOutInput.min = formatDate(tomorrow);
    checkOutInput.value = formatDate(defaultCheckout);

    async function updatePricing() {
        const start = new Date(checkInInput.value);
        const end = new Date(checkOutInput.value);

        if (start >= end) {
            if (reserveBtn) reserveBtn.disabled = true;
            return;
        }

        const diffTime = Math.abs(end - start);
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        if (typeof listingPrice !== "undefined") {
            const basePrice = listingPrice * nights;
            const cleanFee = typeof cleaningFee !== "undefined" ? cleaningFee : 500;
            const serviceFee = Math.round(basePrice * 0.12);
            const taxFee = Math.round((basePrice + serviceFee) * 0.18);
            const total = basePrice + cleanFee + serviceFee + taxFee;

            if (numNightsSpan) numNightsSpan.textContent = nights;
            if (basePriceDisplay) basePriceDisplay.textContent = `₹ ${basePrice.toLocaleString("en-IN")}`;
            if (serviceFeeDisplay) serviceFeeDisplay.textContent = `₹ ${serviceFee.toLocaleString("en-IN")}`;
            if (taxFeeDisplay) taxFeeDisplay.textContent = `₹ ${taxFee.toLocaleString("en-IN")}`;
            if (totalPriceDisplay) totalPriceDisplay.textContent = `₹ ${total.toLocaleString("en-IN")}`;
        }

        // Live Availability API Check
        if (typeof listingId !== "undefined") {
            try {
                const response = await fetch(
                    `/listings/${listingId}/availability?checkIn=${checkInInput.value}&checkOut=${checkOutInput.value}`
                );
                const data = await response.json();
                if (!data.available) {
                    if (reserveBtn) {
                        reserveBtn.disabled = true;
                        reserveBtn.textContent = "Dates Unavailable";
                        reserveBtn.classList.remove("btn-book-now");
                        reserveBtn.classList.add("btn-secondary");
                    }
                } else {
                    if (reserveBtn) {
                        reserveBtn.disabled = false;
                        reserveBtn.textContent = "Reserve";
                        reserveBtn.classList.add("btn-book-now");
                        reserveBtn.classList.remove("btn-secondary");
                    }
                }
            } catch (e) {
                console.error("Availability check error:", e);
            }
        }
    }

    checkInInput.addEventListener("change", () => {
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = formatDate(nextDay);
        if (new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
            checkOutInput.value = formatDate(nextDay);
        }
        updatePricing();
    });

    checkOutInput.addEventListener("change", updatePricing);

    // Initial calculation
    updatePricing();
});
