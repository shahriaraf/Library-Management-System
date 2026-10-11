const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const { EJSON } = require("bson");
require("dotenv").config();

const URL =
  process.env.CONNECTION_URL ||
  "mongodb://127.0.0.1:27017/librarymgmtsystem";

const FILES = [
  ["bookslists", "bookslists.json"],
  ["popularbooks", "popularbooks.json"],
  ["userdetails", "userdetails.json"],
  ["useremailverifications", "useremailverifications.json"],
];

async function run() {
  await mongoose.connect(URL);
  const db = mongoose.connection.db;
  console.log("Connected to database:", db.databaseName);

  for (const [collection, file] of FILES) {
    const fullPath = path.join(__dirname, "..", "mongoDatabase", file);
    const docs = EJSON.parse(fs.readFileSync(fullPath, "utf8"));

    try {
      const result = await db
        .collection(collection)
        .insertMany(docs, { ordered: false });
      console.log(collection + ": inserted " + result.insertedCount);
    } catch (err) {
      if (err.code === 11000 || err.writeErrors) {
        console.log(collection + ": already exists, duplicates skipped");
      } else {
        throw err;
      }
    }
  }

  await mongoose.disconnect();
  console.log("Seeding finished.");
}

run().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});