const bcrypt = require("bcryptjs");
const path = require("path");
const { readData, writeData, generateUserId } = require("../utils/helpers");
const { generateToken } = require("../middleware/auth");
const { validateEmail, validatePassword } = require("../middleware/validation");

const usersDataPath = path.join(__dirname, "../../data/users.json");

// Sign up new user
exports.signup = (req, res) => {
  const { email, password, name } = req.body;

  // Validation
  if (!email || !validateEmail(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid email format" });
  }
  if (!password || !validatePassword(password)) {
    return res
      .status(400)
      .json({
        success: false,
        error: "Password must be at least 6 characters",
      });
  }
  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ success: false, error: "Name must be at least 2 characters" });
  }

  let users = readData(usersDataPath);

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, error: "User already exists with this email" });
  }

  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = {
    id: generateUserId(),
    email,
    password: hashedPassword,
    name,
    created_at: new Date().toISOString(),
  };

  users.push(newUser);
  writeData(usersDataPath, users);

  const token = generateToken(newUser);
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    userId: newUser.id,
    token,
  });
};

// Login user
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and password required" });
  }

  let users = readData(usersDataPath);
  const user = users.find((u) => u.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid email or password" });
  }

  const token = generateToken(user);
  res.json({
    success: true,
    message: "Login successful",
    userId: user.id,
    name: user.name,
    email: user.email,
    token,
  });
};

// Get user profile
exports.getUserProfile = (req, res) => {
  let users = readData(usersDataPath);
  const user = users.find((u) => u.id === req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
    },
  });
};

// Update user profile
exports.updateProfile = (req, res) => {
  const { name } = req.body;

  if (!name || name.trim().length < 2) {
    return res
      .status(400)
      .json({ success: false, error: "Name must be at least 2 characters" });
  }

  let users = readData(usersDataPath);
  const userIndex = users.findIndex((u) => u.id === req.user.id);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  users[userIndex].name = name;
  writeData(usersDataPath, users);

  res.json({ success: true, message: "Profile updated successfully" });
};
