const mongoose = require("mongoose")
const user = new mongoose.Schema({
  booktitle: {
    type: String,
  },
  Author: {
    type: String,
  },
});

const userModel = new mongoose.model("emp", user);

module.exports = userModel;