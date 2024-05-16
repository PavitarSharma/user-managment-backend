import express from "express";
import dotenv from "dotenv";
import connectToDB from "./config/dbConfig.js";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Routes
app.use("/api/v1/user", userRoutes);

// Start server and connect to DB
app.listen(PORT, () => {
  // Debugging: Log the MongoDB URL to ensure it's loaded correctly
  console.log("MONGODB_URL:", process.env.MONGODB_URL);
  
  // Connect to MongoDB
  connectToDB(process.env.MONGODB_URL)
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));
    
  console.log("Server is running on port", PORT);
});
