require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_admin",
  )
  .then(async () => {
    console.log("MongoDB Connected successfully");

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ username: "admin" });
    if (existingAdmin) {
      console.log("Admin user already exists.");
      process.exit();
    }

    // Create new admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new Admin({
      username: "admin",
      password: hashedPassword,
    });

    await admin.save();
    console.log(
      "Admin user created successfully! Username: admin, Password: admin123",
    );
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
