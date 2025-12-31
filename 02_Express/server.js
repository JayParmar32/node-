const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

let student = [
  { id: 1, name: "jay" },
  { id: 2, name: "kunj" }
];

app.get("/", (req, res) => {
  res.render("index", { student });
});

app.post("/insertData", (req, res) => {
  const { id, name } = req.body;
  student.push({ id, name });
  res.redirect("/");
});

app.get("/delete", (req, res) => {
  const id = req.query.id;
  student = student.filter(el => el.id != id);
  res.redirect("/");
});

app.listen(7890, () => {
  console.log("Server running at http://localhost:7890");
});
