const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });
const DB_NAME = require("../constant/dbname.js");

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      "MONGO DB!! Database is connected to server at ",
      connectionInstance.connection.host
    );
  } catch (error) {
    console.log(`MONGO DB connection error ${error}`);
    process.exit(1);
  }
};

module.exports = connectDB;
