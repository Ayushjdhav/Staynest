// Single Listing Map
document.addEventListener("DOMContentLoaded", () => {
    const mapEl = document.getElementById("map");
    if (!mapEl || typeof coordinates === "undefined" || !coordinates || coordinates.length < 2) {
        return;
    }

    const mapKey = typeof apiKey !== "undefined" && apiKey ? apiKey : "6abadc9804864f5890f0286229c06ec0";

    const map = new maplibregl.Map({
        container: "map",
        style: `https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=${mapKey}`,
        center: coordinates,
        zoom: 13,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    const popup = new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 6px; font-family: inherit;">
            <h6 style="margin: 0; font-weight: 700;">${typeof listingTitle !== "undefined" ? listingTitle : "Exact Location"}</h6>
            <p style="margin: 0; font-size: 0.8rem; color: #717171;">Exact directions provided after booking confirmation.</p>
        </div>
    `);

    // Red pin marker
    const marker = new maplibregl.Marker({ color: "#ff385c" })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);

    marker.togglePopup();
});
