const path = require("path");
const { readData, writeData, generateReviewId } = require("../utils/helpers");
const { validateReview } = require("../middleware/validation");

const reviewsDataPath = path.join(__dirname, "../../data/reviews.json");

// Add a review
exports.addReview = (req, res) => {
  const { hotel_id, rating, comment } = req.body;

  // Validation
  const errors = validateReview(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  let reviews = readData(reviewsDataPath);

  const newReview = {
    id: generateReviewId(),
    hotel_id: parseInt(hotel_id),
    user_id: req.user ? req.user.id : null,
    rating: parseInt(rating),
    comment,
    created_at: new Date().toISOString(),
    helpful_count: 0,
  };

  reviews.push(newReview);
  writeData(reviewsDataPath, reviews);

  res.status(201).json({
    success: true,
    message: "Review added successfully",
    reviewId: newReview.id,
  });
};

// Get reviews for a hotel
exports.getHotelReviews = (req, res) => {
  const hotelId = parseInt(req.params.hotelId);
  let reviews = readData(reviewsDataPath);
  const hotelReviews = reviews.filter((r) => r.hotel_id === hotelId);

  // Sort by most recent
  hotelReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Calculate stats
  const totalReviews = hotelReviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          hotelReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        ).toFixed(1)
      : 0;

  const ratingDistribution = {
    5: hotelReviews.filter((r) => r.rating === 5).length,
    4: hotelReviews.filter((r) => r.rating === 4).length,
    3: hotelReviews.filter((r) => r.rating === 3).length,
    2: hotelReviews.filter((r) => r.rating === 2).length,
    1: hotelReviews.filter((r) => r.rating === 1).length,
  };

  res.json({
    success: true,
    totalReviews,
    averageRating,
    ratingDistribution,
    reviews: hotelReviews,
  });
};

// Get user's reviews
exports.getUserReviews = (req, res) => {
  let reviews = readData(reviewsDataPath);
  const userReviews = reviews.filter((r) => r.user_id === req.user.id);

  userReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.json({
    success: true,
    count: userReviews.length,
    reviews: userReviews,
  });
};

// Update review
exports.updateReview = (req, res) => {
  const reviewId = req.params.id;
  const { rating, comment } = req.body;

  let reviews = readData(reviewsDataPath);
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

  if (reviewIndex === -1) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }

  const review = reviews[reviewIndex];

  // Check authorization
  if (review.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ success: false, error: "Not authorized to update this review" });
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res
      .status(400)
      .json({ success: false, error: "Rating must be between 1 and 5" });
  }

  if (rating) review.rating = parseInt(rating);
  if (comment) review.comment = comment;
  review.updated_at = new Date().toISOString();

  reviews[reviewIndex] = review;
  writeData(reviewsDataPath, reviews);

  res.json({ success: true, message: "Review updated successfully" });
};

// Delete review
exports.deleteReview = (req, res) => {
  const reviewId = req.params.id;
  let reviews = readData(reviewsDataPath);
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

  if (reviewIndex === -1) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }

  const review = reviews[reviewIndex];

  // Check authorization
  if (review.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ success: false, error: "Not authorized to delete this review" });
  }

  reviews.splice(reviewIndex, 1);
  writeData(reviewsDataPath, reviews);

  res.json({ success: true, message: "Review deleted successfully" });
};

// Mark review as helpful (admin/general)
exports.markHelpful = (req, res) => {
  const reviewId = req.params.id;
  let reviews = readData(reviewsDataPath);
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

  if (reviewIndex === -1) {
    return res.status(404).json({ success: false, error: "Review not found" });
  }

  reviews[reviewIndex].helpful_count += 1;
  writeData(reviewsDataPath, reviews);

  res.json({ success: true, message: "Marked as helpful" });
};
