const express = require("express");
const hotelController = require("../controllers/hotelController");

const router = express.Router();

// Public routes
router.get("/search", hotelController.searchHotels);
router.get("/:id", hotelController.getHotelDetails);
router.get("/api/amenities", hotelController.getAmenities);

module.exports = router;
