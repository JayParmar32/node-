const express = require("express");
const db = require("./config/db");   
const userModel = require("./model/booktitle");

const app = express();
app.use(express.json());

// ADD
app.post("/insertData", async (req, res) => {
  const data = await userModel.create(req.body);
  res.json(data);
});

// GET
app.get("/", async (req, res) => {
  const data = await userModel.find();
  res.json(data);
});

// DELETE
app.delete("/:id", async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// UPDATE
app.patch("/:id", async (req, res) => {
  await userModel.findByIdAndUpdate(req.params.id, req.body);
  res.send("Updated");
});

app.listen(7000, () => console.log("Server running at http://localhost:7000"));