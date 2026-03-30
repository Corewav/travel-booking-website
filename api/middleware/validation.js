// Validation middleware
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone);
}

function validatePassword(password) {
  return password && password.length >= 6;
}

function validateBooking(data) {
  const errors = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!validateEmail(data.email)) {
    errors.push("Invalid email format");
  }
  if (!validatePhone(data.phone)) {
    errors.push("Phone must be at least 10 digits");
  }
  if (!data.hotel_id || data.hotel_id <= 0) {
    errors.push("Valid hotel ID required");
  }
  if (!data.check_in || !data.check_out) {
    errors.push("Check-in and check-out dates required");
  }
  if (new Date(data.check_out) <= new Date(data.check_in)) {
    errors.push("Check-out date must be after check-in date");
  }
  if (!data.guests || data.guests < 1) {
    errors.push("At least 1 guest required");
  }

  return errors;
}

function validateReview(data) {
  const errors = [];

  if (!data.hotel_id || data.hotel_id <= 0) {
    errors.push("Valid hotel ID required");
  }
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }
  if (!data.comment || data.comment.trim().length < 5) {
    errors.push("Comment must be at least 5 characters");
  }

  return errors;
}

// Validation middleware function for use with express
function validateInput(validator) {
  return (req, res, next) => {
    const errors = validator(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }
    next();
  };
}

module.exports = {
  validateEmail,
  validatePhone,
  validatePassword,
  validateBooking,
  validateReview,
  validateInput,
};
