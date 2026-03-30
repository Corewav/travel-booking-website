const path = require("path");
const {
  readData,
  writeData,
  generateBookingId,
  calculateTotalPrice,
} = require("../utils/helpers");

const bookingsDataPath = path.join(__dirname, "../../data/bookings.json");
const hotelsDataPath = path.join(__dirname, "../../data/hotels.json");

// Create a booking
exports.createBooking = (req, res) => {
  const {
    name,
    email,
    phone,
    hotel_id,
    hotel_name,
    check_in,
    check_out,
    price,
    guests,
  } = req.body;
  const userId = req.user ? req.user.id : null;

  const totalPrice = calculateTotalPrice(price, check_in, check_out);

  const newBooking = {
    id: generateBookingId(),
    user_id: userId,
    name,
    email,
    phone,
    hotel_id,
    hotel_name,
    check_in,
    check_out,
    guests: parseInt(guests),
    price_per_night: price,
    total_price: totalPrice,
    status: "Pending Payment",
    created_at: new Date().toISOString(),
    payment_date: null,
    cancellation_date: null,
  };

  let bookings = readData(bookingsDataPath);
  bookings.push(newBooking);
  writeData(bookingsDataPath, bookings);

  res.status(201).json({
    success: true,
    message: "Booking created successfully",
    bookingId: newBooking.id,
    total_price: totalPrice,
  });
};

// Get user bookings
exports.getUserBookings = (req, res) => {
  let bookings = readData(bookingsDataPath);
  const userBookings = bookings.filter((b) => b.user_id === req.user.id);

  res.json({
    success: true,
    count: userBookings.length,
    bookings: userBookings,
  });
};

// Get all bookings (admin)
exports.getAllBookings = (req, res) => {
  let bookings = readData(bookingsDataPath);
  res.json({ success: true, count: bookings.length, bookings });
};

// Get booking details
exports.getBookingDetails = (req, res) => {
  const bookingId = req.params.id;
  let bookings = readData(bookingsDataPath);
  const booking = bookings.find((b) => b.id === bookingId);

  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  // Check authorization
  if (req.user && booking.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ success: false, error: "Not authorized to view this booking" });
  }

  res.json({ success: true, booking });
};

// Process payment
exports.processPayment = (req, res) => {
  const { booking_id, card_number, expiry, cvv } = req.body;

  // Simple validation
  if (!card_number || card_number.length < 12 || !expiry || !cvv) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid payment details" });
  }

  let bookings = readData(bookingsDataPath);
  let bookingFound = false;

  bookings = bookings.map((b) => {
    if (b.id === booking_id) {
      if (req.user && b.user_id !== req.user.id) {
        return b;
      }
      b.status = "Confirmed";
      b.payment_date = new Date().toISOString();
      bookingFound = true;
    }
    return b;
  });

  if (bookingFound) {
    writeData(bookingsDataPath, bookings);
    res.json({
      success: true,
      message: "Payment successful, booking confirmed",
    });
  } else {
    res.status(404).json({ success: false, error: "Booking not found" });
  }
};

// Cancel booking
exports.cancelBooking = (req, res) => {
  const bookingId = req.params.id;
  let bookings = readData(bookingsDataPath);
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  const booking = bookings[bookingIndex];

  // Check authorization
  if (req.user && booking.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ success: false, error: "Not authorized to cancel this booking" });
  }

  // Check if booking can be cancelled
  if (booking.status === "Cancelled") {
    return res
      .status(400)
      .json({ success: false, error: "Booking already cancelled" });
  }

  // Check if cancellation is within 48 hours before check-in
  const checkInDate = new Date(booking.check_in);
  const now = new Date();
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

  if (hoursUntilCheckIn < 48 && booking.status === "Confirmed") {
    return res
      .status(400)
      .json({
        success: false,
        error: "Cannot cancel within 48 hours of check-in",
      });
  }

  booking.status = "Cancelled";
  booking.cancellation_date = new Date().toISOString();
  bookings[bookingIndex] = booking;

  writeData(bookingsDataPath, bookings);

  res.json({ success: true, message: "Booking cancelled successfully" });
};

// Update booking status (admin)
exports.updateBookingStatus = (req, res) => {
  const { bookingId, status } = req.body;
  const validStatuses = [
    "Pending Payment",
    "Confirmed",
    "Cancelled",
    "Completed",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status" });
  }

  let bookings = readData(bookingsDataPath);
  const bookingIndex = bookings.findIndex((b) => b.id === bookingId);

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, error: "Booking not found" });
  }

  bookings[bookingIndex].status = status;
  writeData(bookingsDataPath, bookings);

  res.json({ success: true, message: "Booking status updated" });
};
