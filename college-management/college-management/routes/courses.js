const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');
const Course = require('../models/Course');
const Department = require('../models/Department');

router.get('/', isAuthenticated, async (req, res) => {
  const courses = await Course.find().populate('department').sort({ name: 1 });
  res.render('courses/index', { title: 'Courses', courses });
});

router.get('/add', isAuthenticated, async (req, res) => {
  const departments = await Department.find({ status: 'Active' });
  res.render('courses/add', { title: 'Add Course', departments });
});

router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    req.flash('success_msg', 'Course added!');
    res.redirect('/courses');
  } catch (err) {
    req.flash('error_msg', 'Error: ' + err.message);
    res.redirect('/courses/add');
  }
});

router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const [course, departments] = await Promise.all([
    Course.findById(req.params.id),
    Department.find({ status: 'Active' })
  ]);
  if (!course) { req.flash('error_msg', 'Not found'); return res.redirect('/courses'); }
  res.render('courses/edit', { title: 'Edit Course', course, departments });
});

router.put('/:id', isAuthenticated, async (req, res) => {
  await Course.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success_msg', 'Course updated!');
  res.redirect('/courses');
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Course deleted');
  res.redirect('/courses');
});

module.exports = router;
