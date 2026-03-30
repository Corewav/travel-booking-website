const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./api/routes/authRoutes");
const hotelRoutes = require("./api/routes/hotelRoutes");
const bookingRoutes = require("./api/routes/bookingRoutes");
const reviewRoutes = require("./api/routes/reviewRoutes");
const adminRoutes = require("./api/routes/adminRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// Legacy endpoints for backward compatibility
app.get("/api/search-hotels", (req, res) => {
  res.redirect(
    301,
    "/api/hotels/search" +
      (req.url.includes("?") ? "?" + req.url.split("?")[1] : ""),
  );
});

app.get("/api/hotel-details/:id", (req, res) => {
  res.redirect(301, `/api/hotels/${req.params.id}`);
});

app.post("/api/book", (req, res) => {
  res.redirect(307, "/api/bookings");
});

app.post("/api/payment", (req, res) => {
  res.redirect(307, "/api/bookings/payment");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Travel Demo Server is running at http://localhost:${PORT}`);
  console.log(`API Documentation:`);
  console.log(
    `  Auth: POST /api/auth/signup, POST /api/auth/login, GET /api/auth/profile`,
  );
  console.log(`  Hotels: GET /api/hotels/search, GET /api/hotels/:id`);
  console.log(
    `  Bookings: POST /api/bookings, GET /api/bookings/:id, DELETE /api/bookings/:id/cancel`,
  );
  console.log(`  Reviews: POST /api/reviews, GET /api/reviews/hotel/:hotelId`);
  console.log(`  Admin: GET /api/admin/dashboard/stats, GET /api/admin/users`);
});
