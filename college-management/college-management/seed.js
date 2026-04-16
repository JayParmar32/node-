/**
 * SEED SCRIPT - Run once to create admin + sample data
 * Usage: node seed.js
 */
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Department = require('./models/Department');
const Course = require('./models/Course');

mongoose.connect('mongodb://127.0.0.1:27017/college_management', {
  useNewUrlParser: true, useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB...');

  // Create admin
  const existingAdmin = await Admin.findOne({ email: 'admin@college.edu' });
  if (!existingAdmin) {
    await Admin.create({ name: 'Super Admin', email: 'admin@college.edu', password: 'admin123' });
    console.log('✅ Admin created: admin@college.edu / admin123');
  }

  // Create departments
  const depts = await Department.insertMany([
    { name: 'Computer Engineering', code: 'CE', head: 'Dr. A. Patel', established: 2000, status: 'Active', description: 'B.Tech programs in CE and IT' },
    { name: 'Mechanical Engineering', code: 'ME', head: 'Prof. R. Shah', established: 1998, status: 'Active', description: 'Core mechanical and production engineering' },
    { name: 'Civil Engineering', code: 'CIVIL', head: 'Dr. K. Mehta', established: 1995, status: 'Active', description: 'Structural and environmental engineering' },
    { name: 'Electronics & Communication', code: 'EC', head: 'Dr. S. Joshi', established: 2002, status: 'Active', description: 'ECE and VLSI programs' },
  ], { ordered: false }).catch(() => Department.find());

  const allDepts = await Department.find();
  const ceId = allDepts.find(d => d.code === 'CE')?._id;
  const meId = allDepts.find(d => d.code === 'ME')?._id;

  if (ceId) {
    await Course.create([
      { name: 'B.Tech Computer Engineering', code: 'BTCE', department: ceId, duration: 4, totalSemesters: 8, fees: 75000, status: 'Active' },
      { name: 'B.Tech Information Technology', code: 'BTIT', department: ceId, duration: 4, totalSemesters: 8, fees: 72000, status: 'Active' },
    ]).catch(() => {});
  }
  if (meId) {
    await Course.create([
      { name: 'B.Tech Mechanical Engineering', code: 'BTME', department: meId, duration: 4, totalSemesters: 8, fees: 70000, status: 'Active' },
    ]).catch(() => {});
  }

  console.log('✅ Sample departments and courses created');
  console.log('\n🚀 Now run: npm start');
  console.log('🌐 Open: http://localhost:3000/login');
  console.log('📧 Email: admin@college.edu  🔑 Password: admin123');
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });
