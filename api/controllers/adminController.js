const path = require("path");
const { readData, writeData } = require("../utils/helpers");

const hotelsDataPath = path.join(__dirname, "../../data/hotels.json");
const bookingsDataPath = path.join(__dirname, "../../data/bookings.json");
const usersDataPath = path.join(__dirname, "../../data/users.json");

// Get dashboard stats
exports.getDashboardStats = (req, res) => {
  const bookings = readData(bookingsDataPath);
  const users = readData(usersDataPath);
  const hotels = readData(hotelsDataPath);

  const stats = {
    totalBookings: bookings.length,
    confirmedBookings: bookings.filter((b) => b.status === "Confirmed").length,
    pendingBookings: bookings.filter((b) => b.status === "Pending Payment")
      .length,
    cancelledBookings: bookings.filter((b) => b.status === "Cancelled").length,
    totalUsers: users.length,
    totalHotels: hotels.length,
    totalRevenue: bookings
      .filter((b) => b.status === "Confirmed")
      .reduce((sum, b) => sum + b.total_price, 0),
  };

  res.json({ success: true, stats });
};

// Get all users
exports.getAllUsers = (req, res) => {
  let users = readData(usersDataPath);

  // Remove passwords from response
  users = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    created_at: u.created_at,
  }));

  res.json({ success: true, count: users.length, users });
};

// Get user details
exports.getUserDetails = (req, res) => {
  const userId = req.params.id;
  let users = readData(usersDataPath);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  let bookings = readData(bookingsDataPath);
  const userBookings = bookings.filter((b) => b.user_id === userId);

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      totalBookings: userBookings.length,
    },
    bookings: userBookings,
  });
};

// Add or update hotel
exports.manageHotel = (req, res) => {
  const {
    id,
    name,
    location,
    price,
    rating,
    image,
    description,
    available_rooms,
  } = req.body;

  let hotels = readData(hotelsDataPath);

  if (id) {
    // Update existing hotel
    const hotelIndex = hotels.findIndex((h) => h.id === parseInt(id));
    if (hotelIndex === -1) {
      return res.status(404).json({ success: false, error: "Hotel not found" });
    }

    hotels[hotelIndex] = {
      id: parseInt(id),
      name: name || hotels[hotelIndex].name,
      location: location || hotels[hotelIndex].location,
      price: price || hotels[hotelIndex].price,
      rating: rating || hotels[hotelIndex].rating,
      image: image || hotels[hotelIndex].image,
      description: description || hotels[hotelIndex].description,
      available_rooms:
        available_rooms !== undefined
          ? available_rooms
          : hotels[hotelIndex].available_rooms,
    };

    writeData(hotelsDataPath, hotels);
    res.json({ success: true, message: "Hotel updated successfully" });
  } else {
    // Add new hotel
    const newHotel = {
      id: Math.max(...hotels.map((h) => h.id), 0) + 1,
      name,
      location,
      price: parseFloat(price),
      rating: parseFloat(rating) || 4.0,
      image,
      description,
      available_rooms: parseInt(available_rooms) || 10,
    };

    hotels.push(newHotel);
    writeData(hotelsDataPath, hotels);
    res.status(201).json({
      success: true,
      message: "Hotel added successfully",
      hotelId: newHotel.id,
    });
  }
};

// Delete hotel
exports.deleteHotel = (req, res) => {
  const hotelId = parseInt(req.params.id);
  let hotels = readData(hotelsDataPath);
  const hotelIndex = hotels.findIndex((h) => h.id === hotelId);

  if (hotelIndex === -1) {
    return res.status(404).json({ success: false, error: "Hotel not found" });
  }

  hotels.splice(hotelIndex, 1);
  writeData(hotelsDataPath, hotels);

  res.json({ success: true, message: "Hotel deleted successfully" });
};

// Get booking analytics
exports.getBookingAnalytics = (req, res) => {
  let bookings = readData(bookingsDataPath);

  // Monthly bookings
  const monthlyBookings = {};
  bookings.forEach((b) => {
    const month = new Date(b.created_at).toISOString().substring(0, 7);
    monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
  });

  // Top hotels by bookings
  const hotelBookingCount = {};
  bookings.forEach((b) => {
    hotelBookingCount[b.hotel_name] =
      (hotelBookingCount[b.hotel_name] || 0) + 1;
  });
  const topHotels = Object.entries(hotelBookingCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  res.json({
    success: true,
    monthlyBookings,
    topHotels: topHotels.map(([name, count]) => ({ name, count })),
  });
};
