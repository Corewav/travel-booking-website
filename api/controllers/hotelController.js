const path = require("path");
const { readData } = require("../utils/helpers");

const hotelsDataPath = path.join(__dirname, "../../data/hotels.json");
const reviewsDataPath = path.join(__dirname, "../../data/reviews.json");

// Get all hotels with advanced filtering
exports.searchHotels = (req, res) => {
  const { location, minPrice, maxPrice, minRating, sortBy } = req.query;
  let hotels = readData(hotelsDataPath);

  // Filter by location
  if (location) {
    const lowerLoc = location.toLowerCase();
    hotels = hotels.filter(
      (h) =>
        h.location.toLowerCase().includes(lowerLoc) ||
        h.name.toLowerCase().includes(lowerLoc),
    );
  }

  // Filter by price range
  if (minPrice) {
    hotels = hotels.filter((h) => h.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    hotels = hotels.filter((h) => h.price <= parseInt(maxPrice));
  }

  // Filter by minimum rating
  if (minRating) {
    hotels = hotels.filter((h) => h.rating >= parseFloat(minRating));
  }

  // Add average review rating to each hotel
  const reviews = readData(reviewsDataPath);
  hotels = hotels.map((hotel) => {
    const hotelReviews = reviews.filter((r) => r.hotel_id === hotel.id);
    const avgRating =
      hotelReviews.length > 0
        ? (
            hotelReviews.reduce((sum, r) => sum + r.rating, 0) /
            hotelReviews.length
          ).toFixed(1)
        : hotel.rating;
    return {
      ...hotel,
      averageRating: avgRating,
      reviewCount: hotelReviews.length,
    };
  });

  // Sorting
  switch (sortBy) {
    case "price-asc":
      hotels.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      hotels.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      hotels.sort(
        (a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating),
      );
      break;
    case "rating-asc":
      hotels.sort(
        (a, b) => parseFloat(a.averageRating) - parseFloat(b.averageRating),
      );
      break;
    default:
      break;
  }

  res.json({ success: true, count: hotels.length, hotels });
};

// Get hotel details
exports.getHotelDetails = (req, res) => {
  const hotelId = parseInt(req.params.id);
  let hotels = readData(hotelsDataPath);
  const hotel = hotels.find((h) => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ success: false, error: "Hotel not found" });
  }

  // Get reviews for this hotel
  const reviews = readData(reviewsDataPath);
  const hotelReviews = reviews.filter((r) => r.hotel_id === hotelId);

  res.json({
    success: true,
    hotel: {
      ...hotel,
      reviews: hotelReviews,
      reviewCount: hotelReviews.length,
      averageRating:
        hotelReviews.length > 0
          ? (
              hotelReviews.reduce((sum, r) => sum + r.rating, 0) /
              hotelReviews.length
            ).toFixed(1)
          : hotel.rating,
    },
  });
};

// Get hotel amenities
exports.getAmenities = (req, res) => {
  const amenitiesList = {
    "Free WiFi": true,
    "Swimming Pool": true,
    Gym: true,
    Spa: true,
    Restaurant: true,
    "Room Service": true,
    "Air Conditioning": true,
    "Breakfast Included": true,
  };

  res.json({ success: true, amenities: amenitiesList });
};
