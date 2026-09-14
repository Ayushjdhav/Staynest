/**
 * StayNest Global Verified Accommodation Dataset
 * High-resolution verified images, rich descriptions, and authentic specs.
 */

const stayNestListings = [
  {
    title: "Aura Oceanfront Luxury Villa & Infinity Pool",
    description: "Perched right above the golden sands of Vagator Beach, Aura Villa offers panoramic Arabian Sea views, a private heated infinity pool, private beach access, floor-to-ceiling glass walls, and a dedicated host team for an unforgettable coastal getaway.",
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
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No smoking indoors", "Quiet hours after 10:00 PM"],
    image: {
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      filename: "aura_villa_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", filename: "aura_villa_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", filename: "aura_villa_2" },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", filename: "aura_villa_3" },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", filename: "aura_villa_4" },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", filename: "aura_villa_5" }
    ],
    geometry: { type: "Point", coordinates: [73.7438, 15.6029] }
  },
  {
    title: "Cedar Haven Alpine Glass Cabin",
    description: "Nestled amidst ancient Himalayan deodar forests in Old Manali, Cedar Haven is an architectural sanctuary crafted from cedarwood and glass. Wake up to snowcapped peaks, enjoy the private outdoor cedar hot tub, and relax by the stone fireplace.",
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
    houseRules: ["Check-in after 1:00 PM", "Check-out by 10:30 AM", "Pets allowed with prior confirmation"],
    image: {
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      filename: "cedar_haven_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", filename: "cedar_haven_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80", filename: "cedar_haven_2" },
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80", filename: "cedar_haven_3" },
      { url: "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?auto=format&fit=crop&w=1200&q=80", filename: "cedar_haven_4" }
    ],
    geometry: { type: "Point", coordinates: [77.1892, 32.2396] }
  },
  {
    title: "The Royal Haveli & Courtyard Suite",
    description: "Step into 200 years of royal heritage. Located inside the historic Pink City of Jaipur, this private courtyard haveli features hand-painted fresco ceilings, ornate marble archways, lush botanical courtyards, and traditional hospitality.",
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
      url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&q=80",
      filename: "haveli_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&w=1200&q=80", filename: "haveli_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80", filename: "haveli_2" },
      { url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", filename: "haveli_3" },
      { url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80", filename: "haveli_4" }
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
      url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      filename: "udaipur_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", filename: "udaipur_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", filename: "udaipur_2" },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", filename: "udaipur_3" }
    ],
    geometry: { type: "Point", coordinates: [73.6835, 24.5764] }
  },
  {
    title: "Santorini Oia Caldera Cliff Cave Suite",
    description: "An iconic whitewashed cave villa built directly into the volcanic cliffs of Oia. Features a private heated infinity plunge pool overlooking the Aegean Sea, unmatched sunset views, and fresh breakfast service.",
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
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "Adults preferred"],
    image: {
      url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
      filename: "santorini_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80", filename: "santorini_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80", filename: "santorini_2" },
      { url: "https://images.unsplash.com/photo-1507038772120-7fff76f79d74?auto=format&fit=crop&w=1200&q=80", filename: "santorini_3" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "santorini_4" }
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
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM", "Ski equipment storage in dedicated mudroom"],
    image: {
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
      filename: "zermatt_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80", filename: "zermatt_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", filename: "zermatt_2" },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "zermatt_3" }
    ],
    geometry: { type: "Point", coordinates: [7.7491, 46.0207] }
  },
  {
    title: "Ubud Bamboo Forest Treehouse Sanctuary",
    description: "Immerse yourself in Bali's lush jungle canopy. This two-story organic bamboo treehouse features an open-air river stone bath, private hanging daybed over rice terraces, and a morning yoga pavilion.",
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
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "Eco-friendly guidelines apply"],
    image: {
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      filename: "ubud_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80", filename: "ubud_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80", filename: "ubud_2" },
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", filename: "ubud_3" }
    ],
    geometry: { type: "Point", coordinates: [115.2625, -8.5069] }
  },
  {
    title: "Shinjuku Skyline Penthouse & Rooftop Zen Garden",
    description: "Sleek designer penthouse right above Tokyo's vibrant Shinjuku district. Features minimalistic Japanese cedar interiors, smart home automation, soaking onsen tub, and high-speed fiber internet.",
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
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM", "Remove footwear at the entrance genkan"],
    image: {
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      filename: "tokyo_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80", filename: "tokyo_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80", filename: "tokyo_2" },
      { url: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80", filename: "tokyo_3" }
    ],
    geometry: { type: "Point", coordinates: [139.7003, 35.6895] }
  },
  {
    title: "Parisian Chic Haussmannian Flat near Eiffel Tower",
    description: "Classic 7th Arrondissement residence boasting herringbone parquet flooring, vintage crown molding, marble fireplaces, wrought-iron Juliet balconies, and a framed view of the Eiffel Tower.",
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
    houseRules: ["Check-in after 2:00 PM", "Check-out by 11:00 AM", "No parties or unauthorized guests"],
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      filename: "paris_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", filename: "paris_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", filename: "paris_2" },
      { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80", filename: "paris_3" }
    ],
    geometry: { type: "Point", coordinates: [2.3522, 48.8566] }
  },
  {
    title: "Positano Cliffside Villa & Lemon Grove Terrace",
    description: "Suspended between azure skies and Mediterranean waters, this Positano villa features lemon-scented stone terraces, handmade Vietri ceramic tiles, panoramic sea views, and private steps toward Fornillo Beach.",
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
    amenities: ["wifi", "pool", "ac", "kitchen", "beach_access", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:30 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      filename: "positano_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80", filename: "positano_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80", filename: "positano_2" },
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", filename: "positano_3" }
    ],
    geometry: { type: "Point", coordinates: [14.4849, 40.6281] }
  },
  {
    title: "Tuscany Chianti Hills Stone Farmhouse",
    description: "Surrounded by centuries-old olive groves and Sangiovese vineyards in the heart of Chianti. Features exposed chestnut beams, terracotta floors, a wood-fired pizza oven, and a private saltwater pool.",
    price: 21000,
    location: "Greve in Chianti, Tuscany",
    country: "Italy",
    category: "farms",
    propertyType: "house",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 4,
    bathrooms: 2.5,
    maxGuests: 6,
    cleaningFee: 1500,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "pool", "kitchen", "free_parking", "dedicated_workspace"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      filename: "tuscany_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80", filename: "tuscany_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", filename: "tuscany_2" }
    ],
    geometry: { type: "Point", coordinates: [11.3167, 43.5833] }
  },
  {
    title: "Glass Igloo Arctic Northern Lights Lodge",
    description: "Sleep beneath the dancing Aurora Borealis in a heated thermal-glass dome lodge. Features a private wood-burning cedar sauna, snowmobile safari access, and an outdoor hot tub surrounded by snowy pine forests.",
    price: 38000,
    location: "Rovaniemi, Lapland",
    country: "Finland",
    category: "arctic",
    propertyType: "cabin",
    roomType: "entire_place",
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    maxGuests: 2,
    cleaningFee: 2000,
    cancellationPolicy: "strict",
    amenities: ["wifi", "free_parking", "hot_tub", "dedicated_workspace"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80",
      filename: "lapland_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=80", filename: "lapland_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80", filename: "lapland_2" }
    ],
    geometry: { type: "Point", coordinates: [25.7294, 66.5039] }
  },
  {
    title: "Manhattan Central Park Skyline Loft",
    description: "Soak in iconic Manhattan skyline views from this duplex designer loft on the Upper East Side. Features 18-foot ceilings, bespoke art installations, a chef's kitchen with Sub-Zero appliances, and a private terrace.",
    price: 29000,
    location: "New York City, New York",
    country: "United States",
    category: "iconic-cities",
    propertyType: "apartment",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 2200,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "gym", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 11:00 AM", "Doorman building etiquette"],
    image: {
      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
      filename: "nyc_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80", filename: "nyc_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80", filename: "nyc_2" }
    ],
    geometry: { type: "Point", coordinates: [-73.9654, 40.7829] }
  },
  {
    title: "Munnar Tea Estate Heritage Bungalow",
    description: "A colonial plantation bungalow set amidst 50 acres of rolling emerald tea gardens in Munnar. Enjoy fresh single-estate tea tastings on the veranda, mountain mist trails, and locally prepared South Indian feasts.",
    price: 6800,
    location: "Munnar, Kerala",
    country: "India",
    category: "mountains",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 3,
    beds: 3,
    bathrooms: 3,
    maxGuests: 6,
    cleaningFee: 600,
    cancellationPolicy: "flexible",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace"],
    houseRules: ["Check-in after 1:00 PM", "Check-out by 11:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      filename: "munnar_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80", filename: "munnar_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80", filename: "munnar_2" }
    ],
    geometry: { type: "Point", coordinates: [77.0595, 10.0889] }
  },
  {
    title: "Scottish Highlands Historic Castle Gatehouse",
    description: "Live like Scottish nobility in a 16th-century stone gatehouse on an expansive highland estate. Features spiral stone staircases, antique four-poster beds, roaring log fires, and views across Loch Ness.",
    price: 31000,
    location: "Inverness, Scottish Highlands",
    country: "United Kingdom",
    category: "castles",
    propertyType: "cottage",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    maxGuests: 4,
    cleaningFee: 1800,
    cancellationPolicy: "strict",
    amenities: ["wifi", "kitchen", "free_parking", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM"],
    image: {
      url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80",
      filename: "scotland_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?auto=format&fit=crop&w=1200&q=80", filename: "scotland_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80", filename: "scotland_2" }
    ],
    geometry: { type: "Point", coordinates: [-4.2247, 57.4778] }
  },
  {
    title: "Kyoto Traditional Machiya & Bamboo Courtyard",
    description: "Carefully restored traditional wooden machiya townhouse located in historic Gion. Features tatami mat tea rooms, hinoki cypress soaking bath, paper shoji screens, and a serene moss stone garden.",
    price: 19500,
    location: "Gion, Kyoto",
    country: "Japan",
    category: "iconic-cities",
    propertyType: "house",
    roomType: "entire_place",
    bedrooms: 2,
    beds: 3,
    bathrooms: 1.5,
    maxGuests: 4,
    cleaningFee: 1400,
    cancellationPolicy: "moderate",
    amenities: ["wifi", "ac", "kitchen", "dedicated_workspace", "tv"],
    houseRules: ["Check-in after 3:00 PM", "Check-out by 10:00 AM", "Traditional slippers provided indoors"],
    image: {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
      filename: "kyoto_cover"
    },
    images: [
      { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80", filename: "kyoto_1", isCover: true },
      { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80", filename: "kyoto_2" }
    ],
    geometry: { type: "Point", coordinates: [135.7735, 35.0037] }
  }
];

module.exports = stayNestListings;
