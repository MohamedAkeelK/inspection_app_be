import express from "express";
import {
  registerUser,
  loginUser,
  verifyUser,
  getUserProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// -----------------------
// Public Auth Routes
// -----------------------
router.post("/register", registerUser);
router.post("/login", loginUser);

// -----------------------
// Protected User Routes
// -----------------------
router.get("/verify", protect, verifyUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);

export default router;
