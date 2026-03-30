const fs = require("fs");
const path = require("path");

// Helper to read data from JSON files
function readData(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return [];
}

// Helper to write data to JSON files
function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Generate booking ID
function generateBookingId() {
  return "BKG" + Math.floor(100000 + Math.random() * 900000);
}

// Generate user ID
function generateUserId() {
  return "USR" + Math.floor(100000 + Math.random() * 900000);
}

// Generate review ID
function generateReviewId() {
  return "REV" + Math.floor(100000 + Math.random() * 900000);
}

// Calculate days between two dates
function calculateDays(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
}

// Calculate total price
function calculateTotalPrice(pricePerNight, checkIn, checkOut) {
  const days = calculateDays(checkIn, checkOut);
  return pricePerNight * days;
}

module.exports = {
  readData,
  writeData,
  generateBookingId,
  generateUserId,
  generateReviewId,
  calculateDays,
  calculateTotalPrice,
};
