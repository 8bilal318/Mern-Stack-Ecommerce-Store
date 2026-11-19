// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import mongoose from "mongoose";
// import User from "../models/User.js";

// dotenv.config();

// const email = process.argv[2];
// const password = process.argv[3];
// const username = process.argv[4] || email?.split("@")[0];

// if (!email || !password) {
//   console.error("Usage: node scripts/create-admin.js <email> <password> [username]");
//   process.exit(1);
// }

// async function createAdmin() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const existingUser = await User.findOne({ email }).lean();

//   if (existingUser) {
//     console.error(`A user already exists with email: ${email}`);
//     process.exitCode = 1;
//     return;
//   }

//   const existingUsername = await User.findOne({ username }).lean();

//   if (existingUsername) {
//     console.error(`A user already exists with username: ${username}`);
//     process.exitCode = 1;
//     return;
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   const adminUser = await User.create({
//     username,
//     email,
//     password: hashedPassword,
//     role: "admin",
//   });

//   console.log(`Admin user created: ${adminUser.email}`);
// }

// createAdmin()
//   .catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await mongoose.disconnect();
//   });