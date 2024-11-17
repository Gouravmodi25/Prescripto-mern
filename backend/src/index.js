const app = require("./app.js");
const connectDB = require("./db/connection.js");
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log("Server is started at port ", PORT);
    });
  })
  .catch((error) => {
    console.log("Mongo DB Connection Failed", error);
  });
