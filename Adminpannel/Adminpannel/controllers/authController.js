const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res) => {
    if (req.session.adminId) {
        return res.redirect('/dashboard');
    }
    res.render('login', { title: 'Admin Login', error: null });
};

exports.postLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.render('login', { title: 'Admin Login', error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.render('login', { title: 'Admin Login', error: 'Invalid username or password' });
        }

        req.session.adminId = admin._id;
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.render('login', { title: 'Admin Login', error: 'Server Error occurred' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.error("Error destroying session:", err);
        res.redirect('/auth/login');
    });
};
