const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const maxAge = 3 * 24 * 60 * 60; // 3 days
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: maxAge
  });
};

module.exports.register_get = (req, res) => {
  res.render('register');
};

module.exports.login_get = (req, res) => {
  res.render('login');
};

module.exports.register_post = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const userRole = role === 'admin' ? 'admin' : 'user';

    const user = await User.create({ username, password: hashedPassword, role: userRole });
    const token = createToken(user._id, user.role);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.status(400).send('Error registering user.');
  }
};

module.exports.login_post = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        const token = createToken(user._id, user.role);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        return res.redirect('/');
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect username');
  } catch (err) {
    console.log(err);
    res.status(400).send('Invalid credentials');
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};
