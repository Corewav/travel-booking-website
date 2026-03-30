const express = require("express");
const bookingController = require("../controllers/bookingController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public bookings (no auth required)
router.post("/", bookingController.createBooking);
router.post("/payment", bookingController.processPayment);

// Protected routes
router.get(
  "/user-bookings",
  authenticateToken,
  bookingController.getUserBookings,
);
router.get("/:id", bookingController.getBookingDetails);
router.delete(
  "/:id/cancel",
  authenticateToken,
  bookingController.cancelBooking,
);

// Admin routes (requires auth)
router.get("/", authenticateToken, bookingController.getAllBookings);
router.put(
  "/:id/status",
  authenticateToken,
  bookingController.updateBookingStatus,
);

module.exports = router;
