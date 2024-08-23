const mongoose = require("mongoose");
const {logSuccess, logError} = require('../utils/logger');

const db = () => {
  try {
    if(!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }
    mongoose
      .connect(process.env.MONGODB_URI.toString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true
      })
      .then(() => {
        logSuccess("Connected to MongoDB");
      });
  } catch (error) {
    logError("Failed to connect to MongoDB");
    logError(error);
  }
};

module.exports = db;
