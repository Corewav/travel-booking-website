const express = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/hotel/:hotelId", reviewController.getHotelReviews);
router.post("/:id/helpful", reviewController.markHelpful);

// Protected routes
router.post("/", authenticateToken, reviewController.addReview);
router.get(
  "/user/my-reviews",
  authenticateToken,
  reviewController.getUserReviews,
);
router.put("/:id", authenticateToken, reviewController.updateReview);
router.delete("/:id", authenticateToken, reviewController.deleteReview);

module.exports = router;
