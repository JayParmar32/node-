const express = require("express");
const { addUser } = require("../controller/userController");
const U_router = express.Router();

U_router.post("/add",addUser);
U_router.get("/get",addUser)

module.exports = U_router;