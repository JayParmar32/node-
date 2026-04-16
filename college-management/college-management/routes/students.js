const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');
const Student = require('../models/Student');
const Department = require('../models/Department');
const Course = require('../models/Course');

// List
router.get('/', isAuthenticated, async (req, res) => {
  const { search, department, status, semester } = req.query;
  let query = {};
  if (search) query.$or = [
    { name: new RegExp(search, 'i') },
    { enrollmentNo: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') }
  ];
  if (department) query.department = department;
  if (status) query.status = status;
  if (semester) query.semester = semester;

  const students = await Student.find(query).populate('department').populate('course').sort({ createdAt: -1 });
  const departments = await Department.find({ status: 'Active' });
  res.render('students/index', { title: 'Students', students, departments, query: req.query });
});

// Add form
router.get('/add', isAuthenticated, async (req, res) => {
  const departments = await Department.find({ status: 'Active' });
  const courses = await Course.find({ status: 'Active' }).populate('department');
  res.render('students/add', { title: 'Add Student', departments, courses });
});

// POST Add
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    req.flash('success_msg', 'Student added successfully!');
    res.redirect('/students');
  } catch (err) {
    req.flash('error_msg', 'Error: ' + (err.message || 'Could not add student'));
    res.redirect('/students/add');
  }
});

// View single
router.get('/:id', isAuthenticated, async (req, res) => {
  const student = await Student.findById(req.params.id).populate('department').populate('course');
  if (!student) { req.flash('error_msg', 'Student not found'); return res.redirect('/students'); }
  res.render('students/view', { title: student.name, student });
});

// Edit form
router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const [student, departments, courses] = await Promise.all([
    Student.findById(req.params.id),
    Department.find({ status: 'Active' }),
    Course.find({ status: 'Active' }).populate('department')
  ]);
  if (!student) { req.flash('error_msg', 'Student not found'); return res.redirect('/students'); }
  res.render('students/edit', { title: 'Edit Student', student, departments, courses });
});

// PUT Update
router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    req.flash('success_msg', 'Student updated successfully!');
    res.redirect('/students/' + req.params.id);
  } catch (err) {
    req.flash('error_msg', 'Error updating student');
    res.redirect('/students/' + req.params.id + '/edit');
  }
});

// DELETE
router.delete('/:id', isAuthenticated, async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Student deleted');
  res.redirect('/students');
});

module.exports = router;
