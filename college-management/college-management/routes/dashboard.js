const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');
const Course = require('../models/Course');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const [students, faculty, departments, courses] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Department.countDocuments(),
      Course.countDocuments()
    ]);
    const activeStudents = await Student.countDocuments({ status: 'Active' });
    const activeFaculty = await Faculty.countDocuments({ status: 'Active' });
    const recentStudents = await Student.find().populate('department').sort({ createdAt: -1 }).limit(5);
    const recentFaculty = await Faculty.find().populate('department').sort({ createdAt: -1 }).limit(5);

    res.render('dashboard', {
      title: 'Dashboard',
      stats: { students, faculty, departments, courses, activeStudents, activeFaculty },
      recentStudents,
      recentFaculty
    });
  } catch (err) {
    req.flash('error_msg', 'Error loading dashboard');
    res.redirect('/login');
  }
});

module.exports = router;
