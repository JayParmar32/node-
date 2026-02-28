const express = require("express");
const { addUser, getUser } = require("../controller/usercontroller");

const U_router=express.Router()

U_router.post("/add", addUser);
U_router.get("/", getUser);

module.exports = U_router;
