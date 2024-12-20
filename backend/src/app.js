require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// admin router
const adminRouter = require("../src/routes/admin.routes.js");

const app = express();

// cors middleware

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// cookie parser middleware
app.use(cookieParser());

// admin api endpoint
app.use("/api/admin", adminRouter);

module.exports = app;
