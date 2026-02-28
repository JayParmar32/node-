const express = require("express");
const db = require("./config/db");
const username = require("./model/usermodel");
const U_router = require("./route/userRoute");

const app = express();

app.use(express.json());

app.use("/", U_router)

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
