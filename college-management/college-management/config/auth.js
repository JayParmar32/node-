module.exports.isAuthenticated = (req, res, next) => {
  if (req.session.admin) return next();
  req.flash('error_msg', 'Please login to access the admin panel');
  res.redirect('/login');
};
