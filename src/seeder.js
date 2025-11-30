import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Building from "./models/Building.js";

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Building.deleteMany();

    console.log("Old data cleared");

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 10);

    const inspector1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "inspector",
      phone: "555-111-2222",
    });
    console.log("Inspector 1 created");

    const inspector2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "inspector",
      phone: "555-333-4444",
    });
    console.log("Inspector 2 created");

    // Create sample buildings
    const buildingsData = [
      {
        name: "Main Street Apartments",
        address: "123 Main St, New York, NY",
        location: { lat: 40.7128, lng: -74.006 },
        accessNotes: "Call the super before entering",
        keyAccessCodes: "A123",
        assignedInspector: inspector1._id,
        status: "unchecked",
      },
      {
        name: "Broadway Tower",
        address: "456 Broadway, New York, NY",
        location: { lat: 40.715, lng: -74.009 },
        accessNotes: "Main door code is 5678",
        keyAccessCodes: "B567",
        assignedInspector: inspector2._id,
        status: "unchecked",
      },
      {
        name: "Central Office",
        address: "789 Central Ave, New York, NY",
        location: { lat: 40.71, lng: -74.012 },
        accessNotes: "Security desk on first floor",
        keyAccessCodes: "C890",
        assignedInspector: inspector1._id,
        status: "dueSoon",
      },
      {
        name: "Eastside Warehouse",
        address: "321 East St, New York, NY",
        location: { lat: 40.718, lng: -74.002 },
        accessNotes: "Ring the bell, they will let you in",
        keyAccessCodes: "D234",
        assignedInspector: inspector2._id,
        status: "checked",
      },
    ];

    for (const building of buildingsData) {
      try {
        await Building.create(building);
        console.log(`Building created: ${building.name}`);
      } catch (err) {
        console.error(`Error creating building ${building.name}:`, err.message);
      }
    }

    console.log("Seeding complete");
    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();
