require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const articleRoutes = require('./routes/articleRoutes');
const { checkUser } = require('./middleware/authMiddleware');
const articleController = require('./controllers/articleController');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set('view engine', 'ejs');

// Database connection
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/blog_project';
mongoose.connect(dbURI)
  .then((result) => {
    app.listen(5000);
    console.log('Connected to db and listening on port 5000');
  })
  .catch((err) => console.log(err));

// Routes
app.use(checkUser);
app.get('/', articleController.articles_all_get);

app.use(authRoutes);
app.use('/articles', articleRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { pageTitle: 'Not Found' });
});
