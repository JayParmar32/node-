const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');
const Department = require('../models/Department');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

router.get('/', isAuthenticated, async (req, res) => {
  const departments = await Department.find().sort({ name: 1 });
  res.render('departments/index', { title: 'Departments', departments });
});

router.get('/add', isAuthenticated, (req, res) => {
  res.render('departments/add', { title: 'Add Department' });
});

router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    req.flash('success_msg', 'Department added!');
    res.redirect('/departments');
  } catch (err) {
    req.flash('error_msg', 'Error: ' + err.message);
    res.redirect('/departments/add');
  }
});

router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const department = await Department.findById(req.params.id);
  if (!department) { req.flash('error_msg', 'Not found'); return res.redirect('/departments'); }
  res.render('departments/edit', { title: 'Edit Department', department });
});

router.put('/:id', isAuthenticated, async (req, res) => {
  await Department.findByIdAndUpdate(req.params.id, req.body);
  req.flash('success_msg', 'Department updated!');
  res.redirect('/departments');
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  const studCount = await Student.countDocuments({ department: req.params.id });
  const facCount = await Faculty.countDocuments({ department: req.params.id });
  if (studCount > 0 || facCount > 0) {
    req.flash('error_msg', 'Cannot delete: department has students or faculty');
    return res.redirect('/departments');
  }
  await Department.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Department deleted');
  res.redirect('/departments');
});

module.exports = router;
