// AI Travel Planner Wizard and Loading Interactivity
document.addEventListener("DOMContentLoaded", () => {
    const plannerForm = document.getElementById("planner-form");
    const loadingOverlay = document.getElementById("ai-loading-overlay");
    const loadingQuote = document.getElementById("loading-quote");

    const quotes = [
        "Consulting StayNest AI Travel Concierge...",
        "Analyzing top local hidden gems and cultural landmarks...",
        "Matching verified StayNest properties with your budget...",
        "Curating artisan dining spots and scenic sunset points...",
        "Finalizing your day-by-day customized itinerary...",
    ];

    if (plannerForm && loadingOverlay) {
        plannerForm.addEventListener("submit", () => {
            plannerForm.style.display = "none";
            loadingOverlay.style.display = "block";

            let quoteIdx = 0;
            setInterval(() => {
                quoteIdx = (quoteIdx + 1) % quotes.length;
                if (loadingQuote) {
                    loadingQuote.style.opacity = "0";
                    setTimeout(() => {
                        loadingQuote.textContent = quotes[quoteIdx];
                        loadingQuote.style.opacity = "1";
                    }, 200);
                }
            }, 2500);
        });
    }
});
