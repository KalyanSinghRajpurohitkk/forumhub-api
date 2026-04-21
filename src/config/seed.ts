import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import { User } from "../infrastructure/models/user.model";
import { Post } from "../infrastructure/models/post.model";

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB connected");

    // Clear old data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Hash password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Create user
    const user = await User.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "superuser",
    });

    //Create post
    await Post.create({
      title: "Sample Post",
      content: "This is sample data",
      user: user._id,
      likes: [],
      comments: [],
    });

    console.log("Database seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();