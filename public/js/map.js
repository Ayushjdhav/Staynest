// Multi-Listing Interactive Map Discovery
document.addEventListener("DOMContentLoaded", () => {
    const toggleMapBtn = document.getElementById("btn-toggle-map");
    const mapContainer = document.getElementById("map-discovery-container");
    const mapBtnText = document.getElementById("map-btn-text");

    let mapInstance = null;
    let isMapVisible = false;

    if (!toggleMapBtn || !mapContainer) return;

    toggleMapBtn.addEventListener("click", () => {
        isMapVisible = !isMapVisible;

        if (isMapVisible) {
            mapContainer.style.display = "block";
            mapBtnText.textContent = "Show List";
            toggleMapBtn.querySelector("i").className = "fa-solid fa-list";

            if (!mapInstance) {
                initDiscoveryMap();
            } else {
                mapInstance.resize();
            }

            mapContainer.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            mapContainer.style.display = "none";
            mapBtnText.textContent = "Show Map";
            toggleMapBtn.querySelector("i").className = "fa-solid fa-map";
        }
    });

    async function initDiscoveryMap() {
        const apiKey = typeof geoApiKey !== "undefined" && geoApiKey ? geoApiKey : "6abadc9804864f5890f0286229c06ec0";

        mapInstance = new maplibregl.Map({
            container: "map-discovery",
            style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${apiKey}`,
            center: [78.9629, 20.5937], // Center of India or world default
            zoom: 4,
        });

        mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

        try {
            const response = await fetch("/listings/map-data");
            const geoJson = await response.json();

            if (!geoJson.features || geoJson.features.length === 0) return;

            const bounds = new maplibregl.LngLatBounds();

            geoJson.features.forEach((feature) => {
                const coords = feature.geometry.coordinates;
                const prop = feature.properties;

                bounds.extend(coords);

                // Custom Price Pill Marker
                const el = document.createElement("div");
                el.className = "map-price-pill";
                el.innerHTML = `₹ ${(prop.price || 0).toLocaleString("en-IN")}`;

                // Popup with Property Card
                const popup = new maplibregl.Popup({ offset: 15, maxWidth: "260px" }).setHTML(`
                    <div style="border-radius: 12px; overflow: hidden; font-family: inherit;">
                        <img src="${prop.image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400'}" style="width: 100%; height: 120px; object-fit: cover;">
                        <div style="padding: 10px;">
                            <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 2px;">${prop.title}</div>
                            <div style="color: #717171; font-size: 0.8rem; margin-bottom: 6px;">📍 ${prop.location}</div>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="font-weight: 700; font-size: 0.9rem;">₹ ${(prop.price || 0).toLocaleString("en-IN")} <span style="font-size: 0.75rem; color: #717171;">/ night</span></div>
                                <a href="/listings/${prop.id}" class="btn btn-dark btn-sm rounded-pill" style="font-size: 0.75rem; padding: 2px 10px;">View</a>
                            </div>
                        </div>
                    </div>
                `);

                new maplibregl.Marker({ element: el })
                    .setLngLat(coords)
                    .setPopup(popup)
                    .addTo(mapInstance);
            });

            mapInstance.fitBounds(bounds, { padding: 60, maxZoom: 14 });
        } catch (err) {
            console.error("Map discovery loading error:", err);
        }
    }
});