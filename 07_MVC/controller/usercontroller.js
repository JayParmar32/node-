const userModel = require("../model/usermodel");

const addUser = async (req, res) => {
  const data = await userModel.create(req.body);
  return res.send(data);
};

const getUser = async (req, res) => {
  const data = await userModel.find({});
  return res.send(data);
};

module.exports = { addUser, getUser };
