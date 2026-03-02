const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Blog = require('./models/Blog');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/blogDB')
  .then(() => console.log("MongoDB Connected"))

app.get('/', async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.render('index', { blogs });
});

app.get('/blogs/new', (req, res) => {
  res.render('new');
});

app.post('/blogs', async (req, res) => {
  await Blog.create(req.body);
  res.redirect('/');
});

app.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('show', { blog });
});

app.get('/blogs/:id/edit', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.render('edit', { blog });
});

app.put('/blogs/:id', async (req, res) => {
  await Blog.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/blogs/${req.params.id}`);
});

app.delete('/blogs/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});