const express = require("express")
const db = require("./config/db")
const userModel = require("./model/usermodel")
const app = express()

app.use(express.json())
app.post("/insertData", async (req, res) => {
  const data = await userModel.create(req.body)
  return res.send(data)
});

app.get("/", async (req, res) => {
  const data = await userModel.find({})
  return res.send(data)
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id
  const data = await userModel.findByIdAndDelete(id)
  return res.send("Sucess")
});

app.patch("/:id", async (req, res) => {
  const id = req.params.id
  const data = await userModel.findByIdAndUpdate(id, req.body)
  return res.send("Sucess")
});

app.listen(7890, () => {
  console.log("server listen")
});