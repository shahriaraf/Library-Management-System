const mongoose = require("mongoose");

let connectionPromise = null;

const ConnectDatabase = async (connection_url) => {
  if (mongoose.connection.readyState === 1) return;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(connection_url, { serverSelectionTimeoutMS: 10000 })
      .catch((err) => {
        connectionPromise = null;
        throw err;
      });
  }
  await connectionPromise;
};

module.exports = { ConnectDatabase };