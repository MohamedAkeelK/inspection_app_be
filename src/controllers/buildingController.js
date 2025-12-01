import Building from "../models/Building.js";

// ===========================
// CREATE BUILDING
// Inspectors can create buildings; assignedInspector is set to themselves
// ===========================
export const createBuilding = async (req, res, next) => {
  try {
    const buildingData = {
      ...req.body,
      assignedInspector: req.user._id, // Assign to creator
    };

    const building = await Building.create(buildingData);

    // Add building to user's assignedBuildings
    req.user.assignedBuildings.push(building._id);
    await req.user.save();

    res.status(201).json({ message: "Building created", building });
  } catch (err) {
    next(err);
  }
};

// ===========================
// GET ALL BUILDINGS FOR INSPECTOR
// ===========================
export const getAllBuildings = async (req, res, next) => {
  try {
    const buildings = await Building.find({ assignedInspector: req.user._id });
    res.json(buildings);
  } catch (err) {
    next(err);
  }
};

// ===========================
// GET SINGLE BUILDING
// Only if assigned to inspector
// ===========================
export const getBuildingById = async (req, res, next) => {
  try {
    const building = await Building.findById(req.params.buildingId);
    if (!building)
      return res.status(404).json({ message: "Building not found" });

    if (!building.assignedInspector.equals(req.user._id))
      return res
        .status(403)
        .json({ message: "Not authorized to view this building" });

    res.json(building);
  } catch (err) {
    next(err);
  }
};

// ===========================
// UPDATE BUILDING
// Inspectors can update only their buildings
// ===========================
export const updateBuilding = async (req, res, next) => {
  try {
    const building = await Building.findById(req.params.buildingId);
    if (!building)
      return res.status(404).json({ message: "Building not found" });

    if (!building.assignedInspector.equals(req.user._id))
      return res
        .status(403)
        .json({ message: "Not authorized to update this building" });

    // Merge updates: name, address, location, notes, accessNotes, status, etc.
    Object.assign(building, req.body);
    await building.save();

    res.json({ message: "Building updated", building });
  } catch (err) {
    next(err);
  }
};

// ===========================
// DELETE BUILDING
// Inspectors can delete only their buildings
// ===========================
export const deleteBuilding = async (req, res, next) => {
  try {
    const building = await Building.findById(req.params.buildingId);
    if (!building)
      return res.status(404).json({ message: "Building not found" });

    if (!building.assignedInspector.equals(req.user._id))
      return res
        .status(403)
        .json({ message: "Not authorized to delete this building" });

    await building.remove();

    // Remove building from user's assignedBuildings
    req.user.assignedBuildings = req.user.assignedBuildings.filter(
      (bId) => !bId.equals(building._id)
    );
    await req.user.save();

    res.json({ message: "Building deleted" });
  } catch (err) {
    next(err);
  }
};
