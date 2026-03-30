const express = require("express");
const adminController = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Middleware to check if user is admin (simple - can be enhanced)
const isAdmin = (req, res, next) => {
  // For now, anyone who is logged in can access admin routes
  // In production, check against a role/permission system
  if (req.user) {
    next();
  } else {
    res.status(403).json({ success: false, error: "Admin access required" });
  }
};

// Apply middleware
router.use(authenticateToken);
router.use(isAdmin);

// Admin routes
router.get("/dashboard/stats", adminController.getDashboardStats);
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserDetails);
router.post("/hotels", adminController.manageHotel);
router.put("/hotels/:id", adminController.manageHotel);
router.delete("/hotels/:id", adminController.deleteHotel);
router.get("/bookings/analytics", adminController.getBookingAnalytics);

module.exports = router;
