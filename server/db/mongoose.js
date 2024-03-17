const mongoose = require("mongoose");

const MONGO_URI = process.env.DATABASE_URL;

mongoose.connect(MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB Atlas");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB Atlas connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB Atlas");
});

const db = mongoose.connection;
module.exports = { db };
