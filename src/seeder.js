import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Building from "./models/Building.js";

dotenv.config();
connectDB();

// Helper functions to generate random data
const randomStatus = () => {
  const statuses = ["unchecked", "checked", "dueSoon"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const randomDate = () => {
  const start = new Date(2023, 0, 1);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomCode = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return (
    letters[Math.floor(Math.random() * letters.length)] +
    letters[Math.floor(Math.random() * letters.length)] +
    numbers[Math.floor(Math.random() * numbers.length)] +
    numbers[Math.floor(Math.random() * numbers.length)]
  );
};

const randomPhone = () =>
  `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

const randomContact = () => ({
  name: `Contact ${Math.floor(Math.random() * 100)}`,
  phone: randomPhone(),
  email: `contact${Math.floor(Math.random() * 100)}@example.com`,
  role: ["super", "manager", "security"][Math.floor(Math.random() * 3)],
});

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Building.deleteMany();
    console.log("Old data cleared");

    // Create 3 inspector users
    const usersData = [
      {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
        phone: randomPhone(),
      },
      {
        name: "Bob Smith",
        email: "bob@example.com",
        password: "password123",
        phone: randomPhone(),
      },
      {
        name: "Charlie Brown",
        email: "charlie@example.com",
        password: "password123",
        phone: randomPhone(),
      },
    ];

    const users = [];
    for (const u of usersData) {
      const user = await User.create(u);
      users.push(user);
      console.log(`User created: ${user.name}`);
    }

    // Create 10 buildings for each user
    for (const user of users) {
      for (let i = 1; i <= 10; i++) {
        const building = await Building.create({
          name: `Building ${i} - ${user.name.split(" ")[0]}`,
          address: `${100 + i} ${
            ["Main", "Broadway", "Central", "East", "West"][i % 5]
          } St, New York, NY`,
          location: {
            lat: 40.7 + Math.random() * 0.02, // random nearby latitude
            lng: -74 + Math.random() * 0.02, // random nearby longitude
          },
          accessNotes: [
            "Call super",
            "Main door code",
            "Security desk first floor",
            "Ring bell",
          ][i % 4],
          keyAccessCodes: randomCode(),
          contacts: [randomContact(), randomContact()],
          notes: `This is note ${i} for ${user.name}`,
          createdBy: user._id,
          status: randomStatus(),
          lastVisitedDate: randomDate(),
        });
        console.log(`Building created: ${building.name}`);
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
