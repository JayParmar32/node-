const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/blogAuth")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const User = mongoose.model("User", {
    email: { type: String, unique: true },
    password: String
});

const Blog = mongoose.model("Blog", {
    title: String,
    content: String,
    author: String
});

let sessions = {};

function generateSessionId() {
    return crypto.randomBytes(16).toString("hex");
}

function isLoggedIn(req, res, next) {
    const sessionId = req.cookies.sessionId;

    if (sessionId && sessions[sessionId]) {
        req.user = sessions[sessionId];
        next();
    } else {
        res.redirect("/login");
    }
}

// Home
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Signup Page
app.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email,
            password: hashedPassword
        });

        res.redirect("/login");
    } catch (err) {
        res.send("Error during signup");
    }
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login", { error: null });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.render("login", { error: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.render("login", { error: "Wrong password" });
    }

    const sessionId = generateSessionId();
    sessions[sessionId] = user.email;

    res.cookie("sessionId", sessionId);
    res.redirect("/dashboard");
});

// Logout
app.get("/logout", (req, res) => {
    const sessionId = req.cookies.sessionId;
    delete sessions[sessionId];
    res.clearCookie("sessionId");
    res.redirect("/login");
});


app.get("/dashboard", isLoggedIn, async (req, res) => {
    const blogs = await Blog.find();
    res.render("dashboard", { user: req.user, blogs });
});

app.get("/blogs/new", isLoggedIn, (req, res) => {
    res.render("new");
});

app.post("/blogs", isLoggedIn, async (req, res) => {
    const { title, content } = req.body;

    await Blog.create({
        title,
        content,
        author: req.user
    });

    res.redirect("/dashboard");
});

app.get("/blogs/:id", isLoggedIn, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("show", { blog });
});

app.get("/blogs/:id/edit", isLoggedIn, async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    res.render("edit", { blog });
});

app.post("/blogs/:id", isLoggedIn, async (req, res) => {
    const { title, content } = req.body;

    await Blog.findByIdAndUpdate(req.params.id, {
        title,
        content
    });

    res.redirect("/dashboard");
});

app.post("/blogs/:id/delete", isLoggedIn, async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});