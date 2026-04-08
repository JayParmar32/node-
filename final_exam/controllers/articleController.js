const Article = require('../models/Article');
const User = require('../models/User');
const Comment = require('../models/Comment');

// Render form to create an article
module.exports.article_create_get = (req, res) => {
  res.render('articleForm');
};

// Handle article creation
module.exports.article_create_post = async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await Article.create({
      title,
      content,
      author: req.user._id
    });
    
    // Add article ref to user
    await User.findByIdAndUpdate(req.user._id, { $push: { articles: article._id } });

    res.redirect('/articles/my-articles');
  } catch (err) {
    console.log(err);
    res.status(400).send('Error creating article');
  }
};

// Render form to edit an article
module.exports.article_edit_get = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    
    // Ensure the current user is the author or an admin
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Forbidden!');
    }

    res.render('articleForm', { article });
  } catch(err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Handle article update
module.exports.article_edit_post = async (req, res) => {
  const { title, content } = req.body;
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Forbidden!');
    }

    article.title = title;
    article.content = content;
    await article.save();

    res.redirect(`/articles/${article._id}`);
  } catch(err) {
    console.log(err);
    res.status(400).send('Error updating article');
  }
};

// Handle article deletion
module.exports.article_delete = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).send('Article not found');
    
    if (article.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).send('Forbidden!');
    }

    // Clean up comments
    await Comment.deleteMany({ article: article._id });
    
    // Remove from User articles
    await User.findByIdAndUpdate(article.author, { $pull: { articles: article._id } });

    await Article.findOneAndDelete({_id: req.params.id});

    res.redirect('/articles/my-articles');
  } catch(err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Get all articles
module.exports.articles_all_get = async (req, res) => {
  try {
    const articles = await Article.find().populate('author', 'username').sort({ createdAt: -1 });
    res.render('articleList', { articles, pageTitle: 'All Articles' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Get my articles
module.exports.articles_my_get = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'articles',
      populate: { path: 'author', select: 'username' },
      options: { sort: { 'createdAt': -1 } }
    });
    res.render('myArticles', { articles: user.articles.filter(a => a), pageTitle: 'My Articles' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Get single article
module.exports.article_single_get = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username' }
      });
      
    if (!article) return res.status(404).send('Article not found');

    res.render('articleItem', { article });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// Post a comment
module.exports.comment_post = async (req, res) => {
  const { content } = req.body;
  try {
    const comment = await Comment.create({
      content,
      author: req.user._id,
      article: req.params.id
    });

    await Article.findByIdAndUpdate(req.params.id, { $push: { comments: comment._id } });
    
    res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    console.log(err);
    res.status(400).send('Error adding comment');
  }
};
