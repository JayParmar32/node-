const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let users = [];
let sessions = {};

function authMiddleware(req, res, next) {
  const sessionId = req.cookies.sessionId;

  if (!sessionId || !sessions[sessionId]) {
    return res.redirect("/login");
  }

  req.user = sessions[sessionId];
  next();
}

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/signup", (req, res) => {
  const { username, password } = req.body;

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.send("User already exists");
  }

  users.push({ username, password });
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return res.send("Invalid credentials");
  }

  const sessionId = Math.random().toString(36).substring(2);
  sessions[sessionId] = user;

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  });

  res.redirect("/dashboard");
});

app.get("/dashboard", authMiddleware, (req, res) => {
  res.render("dashboard", { username: req.user.username });
});

app.get("/logout", authMiddleware, (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId];
    res.clearCookie("sessionId");
  }
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});