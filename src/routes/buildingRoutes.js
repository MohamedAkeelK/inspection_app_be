import express from "express";
import {
  createBuilding,
  getAllBuildings,
  getBuildingById,
  updateBuilding,
  deleteBuilding,
} from "../controllers/buildingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes are protected (inspectors only)
router.use(protect);

// Create a building
router.post("/", createBuilding);

// Get all buildings created/assigned to the logged-in inspector
router.get("/", getAllBuildings);

// Get a single building
router.get("/:buildingId", getBuildingById);

// Update building (includes notes, accessNotes, status, etc.)
router.put("/:buildingId", updateBuilding);

// Delete building
router.delete("/:buildingId", deleteBuilding);

export default router;
