const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const usermodel = require('./model/usermodel');

const app = express();

mongoose.connect('mongodb://localhost:27017/mydatabase');
console.log("MongoDB Connected");

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/upload", express.static(path.join(__dirname,"upload")));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, Date.now()+"-"+file.originalname)
});
const upload = multer({ storage });

// Insert
app.post("/insert", upload.single("image"), async (req, res) => {
  const { name,username, password } = req.body;
  let image = req.file ? "/upload/" + req.file.filename : "";

  await usermodel.create({ name, username, password, image });
  res.redirect("/");
});

// View
app.get("/", async (req, res) => {
  const data = await usermodel.find({});
  res.render("form", { data });
});

// Delete
app.get("/delete/:id", async (req, res) => {
  const user = await usermodel.findById(req.params.id);

  if (user.image) {
    const imgPath = path.join(__dirname, user.image.replace("/",""));
    fs.unlinkSync(imgPath);
  }

  await usermodel.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

app.listen(4000, ()=> console.log("Server running on http://localhost:4000"));
