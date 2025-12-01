import express from "express";
import userRoutes from "./userRoutes.js";
import buildingRoutes from "./buildingRoutes.js";

const router = express.Router();

// User auth + profile routes (login, register, verify, profile)
router.use("/users", userRoutes);

// Building CRUD for inspectors (only buildings they created)
router.use("/buildings", buildingRoutes);

export default router;
