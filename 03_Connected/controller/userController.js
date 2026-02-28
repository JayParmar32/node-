const booktitle = require("../model/booktitle");

const addUser = async (req, res) => {
    const data = await booktitle.create(req.body);
    return res.send(data);
};

const getUser =async (req, res) => {
    const data =await booktitle.find();
    return res.send(data);
};

module.exports = { addUser, getUser };