import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Global middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - body:`, req.body);
  next();
});

// Base test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Mount all API routes
app.use("/api", routes);

// Global error handler (must be after routes)
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
