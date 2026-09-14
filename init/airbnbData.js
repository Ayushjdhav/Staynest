const airbnbListings = [
  {
    title: "Aura Oceanfront Luxury Villa & Infinity Pool",
    description: "Perched right above the golden sands of Vagator Beach, Aura Villa offers panoramic Arabian Sea views, a private heated infinity pool, private beach access, floor-to-ceiling glass walls, and a dedicated butler team for an unforgettable coastal getaway.",
    price: 18500,
    location: "Vagator, Goa",
    country: "India",
    category: "villas",
    propertyType: "villa",
    roomType: "entire_place",
    bedrooms: 4,
    beds: 5,
    bathrooms: 4.5,
    maxGuests: 8,
    cleaningFee: 1500,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "pool", "ac", "kitchen", "free_parking", "hot_tub", "beach_access", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No smoking inside", "Quiet hours after 10:00 PM"],
    image: {
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80",
      filename: "aura_villa_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80", filename: "aura_villa_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80", filename: "aura_villa_2" },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80", filename: "aura_villa_3" },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80", filename: "aura_villa_4" },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80", filename: "aura_villa_5" }
    ],
    geometry: { type: "Point", coordinates: [73.7438, 15.6029] }
  },
  {
    title: "Cedar Haven Alpine Glass Cabin",
    description: "Nestled amidst ancient Himalayan deodar forests in Old Manali, Cedar Haven is an architectural masterpiece crafted from cedarwood and glass. Wake up to snowcapped peaks, enjoy the private outdoor cedar hot tub, and stargaze by the stone fireplace.",
    price: 7800,
    location: "Manali, Himachal Pradesh",
    country: "India",
    category: "mountains",
    propertyType: "cabin",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 800,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "hot_tub", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 10:30 AM", "Pets allowed with prior notice"],
    image: {
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80",
      filename: "cedar_haven_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "cedar_haven_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80", filename: "cedar_haven_2" },
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80", filename: "cedar_haven_3" },
      { url: "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?w=1200&auto=format&fit=crop&q=80", filename: "cedar_haven_4" }
    ],
    geometry: { type: "Point", coordinates: [77.1892, 32.2396] }
  },
  {
    title: "The Royal Haveli & Courtyard Suite",
    description: "Step into 200 years of royal heritage. Located inside the walled historic Pink City of Jaipur, this private courtyard haveli features hand-painted fresco ceilings, ornate marble archways, lush botanical courtyards, and traditional Rajasthani breakfasts.",
    price: 6400,
    location: "Jaipur, Rajasthan",
    country: "India",
    category: "castles",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    maxGuests: 5,
    cleaningFee: 600,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 12:00 PM", "No indoor smoking"],
    image: {
      url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&auto=format&fit=crop&q=80",
      filename: "haveli_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&auto=format&fit=crop&q=80", filename: "haveli_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80", filename: "haveli_2" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80", filename: "haveli_3" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80", filename: "haveli_4" }
    ],
    geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    title: "Lake Pichola Heritage View Apartment",
    description: "Overlooking the tranquil waters of Lake Pichola and the City Palace, this romantic sunlit apartment boasts arched balconies (jharokhas), vintage teak furnishings, and stunning sunset views over Udaipur's serene lakes.",
    price: 5200,
    location: "Udaipur, Rajasthan",
    country: "India",
    category: "amazing-views",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 400,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80",
      filename: "udaipur_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80", filename: "udaipur_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80", filename: "udaipur_2" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80", filename: "udaipur_3" }
    ],
    geometry: { type: "Point", coordinates: [73.6835, 24.5764] }
  },
  {
    title: "Serene Backwaters Teak Houseboat",
    description: "Glide through the emerald canals of Alleppey in a handcrafted cedar & bamboo luxury houseboat. Includes your private captain, onboard chef preparing authentic Kerala prawn curries, and sundeck loungers.",
    price: 11000,
    location: "Alleppey, Kerala",
    country: "India",
    category: "trending",
    propertyType: "chalet",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 1000,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "tv"],
    houseRules: ["Check-in after 12:00 PM", "Check-out by 9:30 AM", "Life jackets required on open deck"],
    image: {
      url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80",
      filename: "alleppey_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&auto=format&fit=crop&q=80", filename: "alleppey_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&auto=format&fit=crop&q=80", filename: "alleppey_2" },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80", filename: "alleppey_3" }
    ],
    geometry: { type: "Point", coordinates: [76.3388, 9.4981] }
  },
  {
    title: "Santorini Oia Caldera Cliff Cave Suite",
    description: "An iconic whitewashed cave villa built directly into the volcanic cliffs of Oia. Features a private heated infinity plunge pool hanging over the Aegean Sea, unmatched sunset views, and daily champagne breakfast.",
    price: 34000,
    location: "Oia, Santorini",
    country: "Greece",
    category: "amazing-views",
    propertyType: "villa",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 2000,
    cancellationPolicy: "strict",
    amenities: ["wifi", "pool", "ac", "kitchen", "hot_tub", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "Adults only"],
    image: {
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80",
      filename: "santorini_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80", filename: "santorini_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80", filename: "santorini_2" },
      { url: "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?w=1200&auto=format&fit=crop&q=80", filename: "santorini_3" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80", filename: "santorini_4" }
    ],
    geometry: { type: "Point", coordinates: [25.3753, 36.4618] }
  },
  {
    title: "Zermatt Matterhorn Luxury Ski Chalet",
    description: "Spectacular timber and stone chalet with direct ski-in/ski-out access in Zermatt. Enjoy uninterrupted floor-to-ceiling vistas of the Matterhorn, a Scandinavian cedar sauna, wine cellar, and outdoor firepit.",
    price: 42000,
    location: "Zermatt, Valais",
    country: "Switzerland",
    category: "mountains",
    propertyType: "chalet",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 3000,
    cancellationPolicy: "strict",
    amenities: ["wifi", "kitchen", "free_parking", "hot_tub", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM", "Ski boots prohibited on parquet floors"],
    image: {
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80",
      filename: "zermatt_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80", filename: "zermatt_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "zermatt_2" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80", filename: "zermatt_3" }
    ],
    geometry: { type: "Point", coordinates: [7.7491, 46.0207] }
  },
  {
    title: "Ubud Bamboo Forest Treehouse Sanctuary",
    description: "Immerse yourself in Bali's lush jungle canopy. This two-story organic bamboo treehouse features an open-air river stone bath, private hanging daybed over rice terraces, and morning yoga pavilion.",
    price: 9500,
    location: "Ubud, Bali",
    country: "Indonesia",
    category: "forest",
    propertyType: "treehouse",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 700,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "pool", "kitchen", "free_parking", "dedicated_workspace"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "Eco-friendly soaps provided and preferred"],
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80",
      filename: "ubud_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80", filename: "ubud_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop&q=80", filename: "ubud_2" },
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80", filename: "ubud_3" }
    ],
    geometry: { type: "Point", coordinates: [115.2625, -8.5069] }
  },
  {
    title: "Shinjuku Skyline Penthouse & Rooftop Zen Garden",
    description: "Sleek designer penthouse right above Tokyo's neon-lit Shinjuku district. Features minimalistic Japanese cedar interiors, smart home automation, soaking onsen tub, and high-speed fiber internet.",
    price: 16500,
    location: "Shinjuku, Tokyo",
    country: "Japan",
    category: "iconic-cities",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 1.5,
    maxGuests: 4,
    cleaningFee: 1200,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM", "Please remove footwear at the genkan entrance"],
    image: {
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80",
      filename: "tokyo_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80", filename: "tokyo_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&auto=format&fit=crop&q=80", filename: "tokyo_2" },
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80", filename: "tokyo_3" }
    ],
    geometry: { type: "Point", coordinates: [139.7003, 35.6895] }
  },
  {
    title: "Parisian Chic Haussmannian Flat near Eiffel Tower",
    description: "Classic 7th Arrondissement apartment boasting herringbone parquet flooring, vintage crown molding, marble fireplaces, wrought-iron Juliet balconies, and a framed view of the Eiffel Tower.",
    price: 24000,
    location: "Paris",
    country: "France",
    category: "iconic-cities",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 1800,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No parties or events"],
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80",
      filename: "paris_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80", filename: "paris_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80", filename: "paris_2" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80", filename: "paris_3" }
    ],
    geometry: { type: "Point", coordinates: [2.3522, 48.8566] }
  },
  {
    title: "Positano Cliffside Villa & Lemon Grove Terrace",
    description: "Suspended between azure skies and Mediterranean waters, this Positano villa features lemon-scented stone terraces, handmade Vietri ceramic tiles, panoramic sea views, and private steps down to Fornillo Beach.",
    price: 36000,
    location: "Positano, Amalfi Coast",
    country: "Italy",
    category: "beach",
    propertyType: "villa",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 2500,
    cancellationPolicy: "strict",
    amenities: ["wifi", "ac", "kitchen", "beach_access", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:30 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
      filename: "positano_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80", filename: "positano_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80", filename: "positano_2" },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80", filename: "positano_3" }
    ],
    geometry: { type: "Point", coordinates: [14.4850, 40.6281] }
  },
  {
    title: "Tuscany Chianti Hills Stone Farmhouse",
    description: "A lovingly restored 17th-century stone farmhouse surrounded by organic olive groves and Sangiovese vineyards in the heart of Chianti. Includes a private infinity pool, wood-fired pizza oven, and local wine cellar.",
    price: 21000,
    location: "Siena, Tuscany",
    country: "Italy",
    category: "farms",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 4,
    beds: 5,
    bathrooms: 4,
    maxGuests: 8,
    cleaningFee: 2000,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "pool", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 4:00 PM", "Check-out by 10:00 AM", "Pets welcome"],
    image: {
      url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80",
      filename: "tuscany_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&auto=format&fit=crop&q=80", filename: "tuscany_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80", filename: "tuscany_2" },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80", filename: "tuscany_3" }
    ],
    geometry: { type: "Point", coordinates: [11.3308, 43.3188] }
  },
  {
    title: "Icelandic Aurora Glass Igloo Dome",
    description: "Gaze at the dancing Northern Lights directly from your heated plush king bed. Located in a secluded lava field outside Reykjavik, this geothermal dome features heated floors, private outdoor hot spring tub, and stargazing telescope.",
    price: 29000,
    location: "Reykjavik",
    country: "Iceland",
    category: "arctic",
    propertyType: "cabin",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 1500,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "kitchen", "free_parking", "hot_tub", "dedicated_workspace"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "No shoes inside dome"],
    image: {
      url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&auto=format&fit=crop&q=80",
      filename: "iceland_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=1200&auto=format&fit=crop&q=80", filename: "iceland_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "iceland_2" },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80", filename: "iceland_3" }
    ],
    geometry: { type: "Point", coordinates: [-21.9426, 64.1466] }
  },
  {
    title: "SoHo Industrial Designer Loft",
    description: "Authentic artist loft in prime SoHo with 14-foot tin ceilings, exposed red brick, polished concrete floors, museum-quality contemporary art, chef's kitchen, and oversized cast-iron sash windows.",
    price: 32000,
    location: "New York",
    country: "United States",
    category: "iconic-cities",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 2200,
    cancellationPolicy: "strict",
    amenities: ["wifi", "ac", "kitchen", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "No commercial filming without permit"],
    image: {
      url: "https://images.unsplash.com/photo-1502005229762-ee1b2da94e0f?w=1200&auto=format&fit=crop&q=80",
      filename: "soho_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502005229762-ee1b2da94e0f?w=1200&auto=format&fit=crop&q=80", filename: "soho_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80", filename: "soho_2" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80", filename: "soho_3" }
    ],
    geometry: { type: "Point", coordinates: [-73.9989, 40.7233] }
  },
  {
    title: "Anjuna Bohemian Beach Cottage",
    description: "Step straight into the sands of North Goa. This whitewashed heritage Portuguese beach cottage features shaded hammocks, an open-air rain shower, vibrant tropical garden, and sunset cocktails right on the beach.",
    price: 4900,
    location: "Anjuna, Goa",
    country: "India",
    category: "beach",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 500,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "beach_access", "tv"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:00 AM", "Pets welcome"],
    image: {
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop&q=80",
      filename: "anjuna_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&auto=format&fit=crop&q=80", filename: "anjuna_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80", filename: "anjuna_2" },
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&auto=format&fit=crop&q=80", filename: "anjuna_3" }
    ],
    geometry: { type: "Point", coordinates: [73.7432, 15.5808] }
  },
  {
    title: "Munnar Misty Tea Plantation Bungalow",
    description: "Wake up amidst rolling carpeted tea gardens and morning mist. This colonial-era granite bungalow offers authentic British architectural charm, crackling fireplace, high tea on the lawn, and guided plantation trails.",
    price: 6800,
    location: "Munnar, Kerala",
    country: "India",
    category: "forest",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 600,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No smoking indoors"],
    image: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      filename: "munnar_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80", filename: "munnar_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80", filename: "munnar_2" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "munnar_3" }
    ],
    geometry: { type: "Point", coordinates: [77.0595, 10.0889] }
  },
  {
    title: "Highland Lochside Stone Castle Tower",
    description: "Live like royalty in a restored 16th-century Scottish castle tower on the shores of Loch Ness. Features stone spiral staircases, four-poster oak beds, grand fireplace, whiskey library, and mist-veiled loch views.",
    price: 38000,
    location: "Inverness, Scottish Highlands",
    country: "United Kingdom",
    category: "castles",
    propertyType: "mansion",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 2500,
    cancellationPolicy: "strict",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 4:00 PM", "Check-out by 10:00 AM", "Candles strictly forbidden due to heritage timber"],
    image: {
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=1200&auto=format&fit=crop&q=80",
      filename: "castle_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=1200&auto=format&fit=crop&q=80", filename: "castle_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80", filename: "castle_2" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80", filename: "castle_3" }
    ],
    geometry: { type: "Point", coordinates: [-4.2247, 57.4778] }
  },
  {
    title: "Kyoto Machiya Traditional Wooden Townhouse",
    description: "A century-old registered traditional Kyoto Machiya located in historic Gion. Features cedarwood scent, tatami tea ceremony room, private moss rock garden, sliding shoji paper doors, and hinoki cypress bath.",
    price: 19500,
    location: "Kyoto",
    country: "Japan",
    category: "trending",
    propertyType: "house",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 4,
    bathrooms: 1.5,
    maxGuests: 5,
    cleaningFee: 1400,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "Traditional slippers provided for tatami floors"],
    image: {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80",
      filename: "kyoto_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&auto=format&fit=crop&q=80", filename: "kyoto_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80", filename: "kyoto_2" },
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&auto=format&fit=crop&q=80", filename: "kyoto_3" }
    ],
    geometry: { type: "Point", coordinates: [135.7681, 35.0116] }
  },
  {
    title: "Dharamshala Pine Valley Glasshouse",
    description: "Surrounded by deodar pines in Upper Dharamkot with unobstructed views of the mighty Dhauladhar mountain range. Includes a sunlit glass reading room, woodstove, high-speed optic fiber for remote work, and outdoor bonfire pit.",
    price: 4500,
    location: "Dharamshala, Himachal Pradesh",
    country: "India",
    category: "mountains",
    propertyType: "cabin",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    maxGuests: 3,
    cleaningFee: 400,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:00 AM", "Eco-conscious guests appreciated"],
    image: {
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
      filename: "dharamshala_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80", filename: "dharamshala_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&auto=format&fit=crop&q=80", filename: "dharamshala_2" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "dharamshala_3" }
    ],
    geometry: { type: "Point", coordinates: [76.3248, 32.2476] }
  },
  {
    title: "Maldives Overwater Lagoon Sunset Villa",
    description: "Suspended over a sparkling turquoise lagoon with glass floor panels to watch tropical marine life. Features direct lagoon steps, private overwater catamaran hammock, infinity plunge pool, and private outdoor rain shower.",
    price: 48000,
    location: "North Male Atoll",
    country: "Maldives",
    category: "luxury",
    propertyType: "villa",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1.5,
    maxGuests: 2,
    cleaningFee: 3500,
    cancellationPolicy: "strict",
    amenities: ["wifi", "pool", "ac", "kitchen", "hot_tub", "beach_access", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 12:00 PM", "Speedboat transfer coordinated 48h prior"],
    image: {
      url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80",
      filename: "maldives_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&auto=format&fit=crop&q=80", filename: "maldives_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&auto=format&fit=crop&q=80", filename: "maldives_2" },
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80", filename: "maldives_3" }
    ],
    geometry: { type: "Point", coordinates: [73.5093, 4.1755] }
  },
  {
    title: "Rishikesh Holy Ganges Cliffside Retreat",
    description: "Perched on a quiet bluff above the rushing waters of the sacred Ganges in Tapovan. Features private yoga deck, meditation alcoves, Ayurvedic tea station, and panoramic Himalayan river views.",
    price: 3900,
    location: "Rishikesh, Uttarakhand",
    country: "India",
    category: "rooms",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 300,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "dedicated_workspace"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:00 AM", "Pure vegetarian environment"],
    image: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
      filename: "rishikesh_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80", filename: "rishikesh_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80", filename: "rishikesh_2" }
    ],
    geometry: { type: "Point", coordinates: [78.3259, 30.1314] }
  },
  {
    title: "Swiss Alpine Chalet Grindelwald Eiger View",
    description: "Picture-postcard wooden chalet standing proudly in front of the sheer Eiger North Face. Enjoy private hot tub on the snowy deck, traditional fondue sets, heated ski boot racks, and cozy pine interiors.",
    price: 31000,
    location: "Grindelwald, Bernese Oberland",
    country: "Switzerland",
    category: "mountains",
    propertyType: "chalet",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 4,
    bathrooms: 2.5,
    maxGuests: 6,
    cleaningFee: 2200,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "kitchen", "free_parking", "hot_tub", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
      filename: "grindelwald_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80", filename: "grindelwald_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?w=1200&auto=format&fit=crop&q=80", filename: "grindelwald_2" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "grindelwald_3" }
    ],
    geometry: { type: "Point", coordinates: [8.0414, 46.6242] }
  },
  {
    title: "Jodhpur Blue City Rooftop Heritage Suite",
    description: "Overlooking the imposing Mehrangarh Fort illuminated at night, this heritage haveli suite features deep cobalt blue walls, carved stone jali windows, antique brass lanterns, and a private rooftop lounge.",
    price: 4200,
    location: "Jodhpur, Rajasthan",
    country: "India",
    category: "amazing-views",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    maxGuests: 3,
    cleaningFee: 350,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "tv"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:30 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80",
      filename: "jodhpur_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80", filename: "jodhpur_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1200&auto=format&fit=crop&q=80", filename: "jodhpur_2" }
    ],
    geometry: { type: "Point", coordinates: [73.0243, 26.2389] }
  },
  {
    title: "South Goa Candolim Luxury Pool Penthouse",
    description: "Modern top-floor penthouse with private plunge pool on a private sun deck, just a 3-minute stroll from Candolim's silver sands. Features Italian marble flooring, espresso bar, and premium surround sound.",
    price: 13500,
    location: "Candolim, Goa",
    country: "India",
    category: "pools",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 1200,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "pool", "ac", "kitchen", "free_parking", "beach_access", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No glassware around pool perimeter"],
    image: {
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      filename: "candolim_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80", filename: "candolim_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80", filename: "candolim_2" },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80", filename: "candolim_3" }
    ],
    geometry: { type: "Point", coordinates: [73.7667, 15.5178] }
  },
  {
    title: "Ooty Emerald Lake Heritage Farm Cottage",
    description: "A serene cottage tucked away near Emerald Lake in the Nilgiri hills. Features blooming rose gardens, organic vegetable patch, cozy woodfire hearth, homemade strawberry jams, and mountain cycling trails.",
    price: 5600,
    location: "Ooty, Tamil Nadu",
    country: "India",
    category: "farms",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 3,
    bathrooms: 2,
    maxGuests: 5,
    cleaningFee: 500,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "Pet friendly"],
    image: {
      url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80",
      filename: "ooty_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1200&auto=format&fit=crop&q=80", filename: "ooty_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?w=1200&auto=format&fit=crop&q=80", filename: "ooty_2" },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&auto=format&fit=crop&q=80", filename: "ooty_3" }
    ],
    geometry: { type: "Point", coordinates: [76.6950, 11.4102] }
  },
  {
    title: "Pondicherry French Quarter Colonial Villa",
    description: "Located in the heritage White Town district with mustard-yellow facade, bougainvillea-draped archways, vintage louvered shutters, cool terracotta tiles, and a sunlit courtyard fountain.",
    price: 7200,
    location: "White Town, Pondicherry",
    country: "India",
    category: "villas",
    propertyType: "villa",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 650,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "ac", "kitchen", "free_parking", "beach_access", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80",
      filename: "pondy_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&auto=format&fit=crop&q=80", filename: "pondy_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&auto=format&fit=crop&q=80", filename: "pondy_2" },
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&auto=format&fit=crop&q=80", filename: "pondy_3" }
    ],
    geometry: { type: "Point", coordinates: [79.8359, 11.9340] }
  }
];

module.exports = airbnbListings;
