const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// GET Login
router.get('/login', (req, res) => {
  if (req.session.admin) return res.redirect('/dashboard');
  res.render('auth/login', { title: 'Admin Login' });
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/login');
    }
    const match = await admin.comparePassword(password);
    if (!match) {
      req.flash('error_msg', 'Invalid email or password');
      return res.redirect('/login');
    }
    req.session.admin = { id: admin._id, name: admin.name, email: admin.email };
    req.flash('success_msg', `Welcome back, ${admin.name}!`);
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error_msg', 'Server error');
    res.redirect('/login');
  }
});

// GET Register (first time setup)
router.get('/register', (req, res) => {
  res.render('auth/register', { title: 'Register Admin' });
});

// POST Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await Admin.findOne({ email });
    if (existing) {
      req.flash('error_msg', 'Admin with this email already exists');
      return res.redirect('/register');
    }
    const admin = new Admin({ name, email, password });
    await admin.save();
    req.flash('success_msg', 'Admin registered! Please login.');
    res.redirect('/login');
  } catch (err) {
    req.flash('error_msg', 'Error registering admin');
    res.redirect('/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Root redirect
router.get('/', (req, res) => res.redirect('/dashboard'));

module.exports = router;
