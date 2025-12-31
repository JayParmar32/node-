const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let student = [
  { id: 1, name: "jay" },
  { id: 2, name: "kunj" }
];

let editValue = {};   // ADD THIS at top (global)

app.get("/", (req, res) => {
  res.render("index", {
    student,
    editValue   // 👈 MUST send this
  });
});

// ADD
app.post("/insertData", (req, res) => {
  const { id, name } = req.body;
  student.push({ id: Number(id), name });
  res.redirect("/");
});

// LOAD EDIT DATA
app.get("/edit", (req, res) => {
  const id = Number(req.query.id);
  editValue = student.find(el => el.id === id) || {};
  res.redirect("/");
});

// UPDATE
app.post("/updateData", (req, res) => {
  const id = Number(req.body.id);
  const name = req.body.name;

  student = student.map(el => el.id === id ? { id, name } : el);
  editValue = {}; // clear after update
  res.redirect("/");
});

// DELETE
app.get("/delete", (req, res) => {
  const id = Number(req.query.id);
  student = student.filter(el => el.id !== id);
  res.redirect("/");
});

app.listen(7890, () => {
  console.log("Server running at http://localhost:7890");
});
