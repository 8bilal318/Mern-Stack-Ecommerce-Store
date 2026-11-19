// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import User from "../models/User.js";

// dotenv.config();

// const email = process.argv[2];

// if (!email) {
//   console.error("Usage: node scripts/set-admin.js <email>");
//   process.exit(1);
// }

// async function setAdmin() {
//   await mongoose.connect(process.env.MONGODB_URI);

//   const user = await User.findOneAndUpdate(
//     { email },
//     { role: "admin" },
//     { returnDocument: "after" },
//   ).lean();

//   if (!user) {
//     console.error(`No user found for email: ${email}`);
//     process.exitCode = 1;
//     return;
//   }

//   console.log(`Admin access granted to ${user.email}`);
// }

// setAdmin()
//   .catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await mongoose.disconnect();
//   });