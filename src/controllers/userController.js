import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ===========================
// REGISTER USER
// ===========================
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({ name, email, password, role, phone });

    // Populate assignedBuildings (empty initially)
    await user.populate("assignedBuildings");

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      assignedBuildings: user.assignedBuildings,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// ===========================
// LOGIN USER
// ===========================
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(403).json({ message: "User account is inactive" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    user.lastLogin = Date.now();
    await user.save();

    // Populate assignedBuildings automatically
    await user.populate("assignedBuildings");

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      assignedBuildings: user.assignedBuildings,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

// ===========================
// VERIFY USER TOKEN
// ===========================
export const verifyUser = async (req, res) => {
  res.json({ user: req.user });
};

// ===========================
// GET USER PROFILE
// ===========================
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("assignedBuildings");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ===========================
// UPDATE USER PROFILE
// ===========================
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    await user.save();
    await user.populate("assignedBuildings");

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    next(err);
  }
};

// ===========================
// CHANGE PASSWORD
// ===========================
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Current password incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
