// Name : Kalyan Singh 
// Course : Open Source Web Programming (PROG3271 - Winter 2026 - Section 1)
// Student id : 9021722
// Final Project :  ForumHub API

import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import authRoutes from "./presentation/routes/auth.routes";
import userRoutes from "./presentation/routes/user.routes";
import postRoutes from "./presentation/routes/post.routes";
import adminRoutes from "./presentation/routes/admin.routes";
import { logger } from "./config/logger";

dotenv.config();

const app = express();

// Connect to the database
connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("ForumHub API is running ");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});