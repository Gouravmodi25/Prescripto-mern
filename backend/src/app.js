require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// admin router
const adminRouter = require("../src/routes/admin.routes.js");
const doctorRouter = require("../src/routes/doctor.routes.js");
const userRouter = require("../src//routes/user.routes.js");

const app = express();

// cors middleware

const allowedOrigins = [
  "http://localhost:5174",
  "https://prescrpito-gourav.netlify.app/doctors",
  "http://localhost:5175",
]; // Add your allowed origins here

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

app.options("*", cors());

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// cookie parser middleware
app.use(cookieParser());

// admin api endpoint
app.use("/api/admin", adminRouter);

app.use("/api/doctor", doctorRouter);

app.use("/api/user", userRouter);

module.exports = app;
