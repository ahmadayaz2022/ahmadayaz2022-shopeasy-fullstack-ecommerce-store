const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin1234", 10);

const admin = await User.create({
  name: "Admin",
  email: "admin1234@gmail.com",
  password: hashedPassword,
  role: "admin", // ✅ IMPORTANT
});

    console.log("Admin created:", admin);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();