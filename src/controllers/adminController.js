import User from "../models/User.js";
import Building from "../models/Building.js";

// ===========================
// GET ALL INSPECTORS
// ===========================
export const getAllInspectors = async (req, res, next) => {
  try {
    const inspectors = await User.find({ role: "inspector" }).select("-password");
    res.json(inspectors);
  } catch (err) {
    next(err);
  }
};

// ===========================
// GET ALL USERS
// ===========================
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// ===========================
// DELETE USER
// ===========================
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted" });
  } catch (err) {
    next(err);
  }
};

// ===========================
// GET ALL BUILDINGS ASSIGNED TO AN INSPECTOR
// ===========================
export const getInspectorBuildings = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("assignedBuildings");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ assignedBuildings: user.assignedBuildings });
  } catch (err) {
    next(err);
  }
};

// ===========================
// ASSIGN MULTIPLE BUILDINGS TO INSPECTOR
// ===========================
export const assignBuildingsBulk = async (req, res, next) => {
  try {
    const { userId, buildingIds } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    buildingIds.forEach((id) => {
      if (!user.assignedBuildings.includes(id)) user.assignedBuildings.push(id);
    });

    await user.save();
    res.json({ message: "Buildings assigned successfully", assignedBuildings: user.assignedBuildings });
  } catch (err) {
    next(err);
  }
};

// ===========================
// REMOVE MULTIPLE BUILDINGS FROM INSPECTOR
// ===========================
export const unassignBuildingsBulk = async (req, res, next) => {
  try {
    const { userId, buildingIds } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.assignedBuildings = user.assignedBuildings.filter((id) => !buildingIds.includes(id.toString()));
    await user.save();

    res.json({ message: "Buildings unassigned successfully", assignedBuildings: user.assignedBuildings });
  } catch (err) {
    next(err);
  }
};
