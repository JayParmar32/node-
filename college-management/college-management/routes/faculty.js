const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../config/auth');
const Faculty = require('../models/Faculty');
const Department = require('../models/Department');

router.get('/', isAuthenticated, async (req, res) => {
  const { search, department, status } = req.query;
  let query = {};
  if (search) query.$or = [
    { name: new RegExp(search, 'i') },
    { employeeId: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') }
  ];
  if (department) query.department = department;
  if (status) query.status = status;
  const faculty = await Faculty.find(query).populate('department').sort({ createdAt: -1 });
  const departments = await Department.find({ status: 'Active' });
  res.render('faculty/index', { title: 'Faculty', faculty, departments, query: req.query });
});

router.get('/add', isAuthenticated, async (req, res) => {
  const departments = await Department.find({ status: 'Active' });
  res.render('faculty/add', { title: 'Add Faculty', departments });
});

router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.subjects) data.subjects = data.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const faculty = new Faculty(data);
    await faculty.save();
    req.flash('success_msg', 'Faculty added successfully!');
    res.redirect('/faculty');
  } catch (err) {
    req.flash('error_msg', 'Error: ' + (err.message || 'Could not add faculty'));
    res.redirect('/faculty/add');
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).populate('department');
  if (!faculty) { req.flash('error_msg', 'Faculty not found'); return res.redirect('/faculty'); }
  res.render('faculty/view', { title: faculty.name, faculty });
});

router.get('/:id/edit', isAuthenticated, async (req, res) => {
  const [faculty, departments] = await Promise.all([
    Faculty.findById(req.params.id),
    Department.find({ status: 'Active' })
  ]);
  if (!faculty) { req.flash('error_msg', 'Faculty not found'); return res.redirect('/faculty'); }
  res.render('faculty/edit', { title: 'Edit Faculty', faculty, departments });
});

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const data = { ...req.body };
    if (data.subjects) data.subjects = data.subjects.split(',').map(s => s.trim()).filter(Boolean);
    await Faculty.findByIdAndUpdate(req.params.id, data);
    req.flash('success_msg', 'Faculty updated!');
    res.redirect('/faculty/' + req.params.id);
  } catch (err) {
    req.flash('error_msg', 'Error updating faculty');
    res.redirect('/faculty/' + req.params.id + '/edit');
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  await Faculty.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Faculty deleted');
  res.redirect('/faculty');
});

module.exports = router;
