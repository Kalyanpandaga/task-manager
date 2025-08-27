import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Task from "../models/Task.js";
import connectDB from "../config/database.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log("🌱 Clearing old data...");
    await User.deleteMany({});
    await Task.deleteMany({});

    console.log("🌱 Inserting users...");

    const manager1 = new User({
      name: "Alice",
      email: "alice.manager@example.com",
      password: "Manager@123", // will be hashed by pre("save")
      role: "MANAGER",
    });

    const manager2 = new User({
      name: "Bob",
      email: "bob.manager@example.com",
      password: "Manager@123",
      role: "MANAGER",
    });

    const intern1 = new User({
      name: "Charlie",
      email: "charlie.intern@example.com",
      password: "Intern@123",
      role: "INTERN",
    });

    const intern2 = new User({
      name: "Dana",
      email: "dana.intern@example.com",
      password: "Intern@123",
      role: "INTERN",
    });

    await manager1.save();
    await manager2.save();
    await intern1.save();
    await intern2.save();

    console.log("✅ Users created!");

    console.log("🌱 Inserting tasks...");

    const task1 = new Task({
      title: "Build Login API",
      description: "Implement authentication with JWT.",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // +3 days
      status: "TODO",
      assignedUsers: [intern1._id],
      createdBy: manager1._id,
    });

    const task2 = new Task({
      title: "Frontend Kanban Board",
      description: "Create a Kanban board with drag & drop using React.",
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 days
      status: "IN_PROGRESS",
      assignedUsers: [intern2._id],
      createdBy: manager2._id,
    });

    const task3 = new Task({
      title: "Database Setup",
      description: "Setup MongoDB schema for tasks & users.",
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 days
      status: "TODO",
      assignedUsers: [intern1._id, intern2._id], // multiple interns
      createdBy: manager1._id,
    });

    await task1.save();
    await task2.save();
    await task3.save();

    console.log("✅ Tasks created!");

    console.log("🎉 Seeding completed successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
