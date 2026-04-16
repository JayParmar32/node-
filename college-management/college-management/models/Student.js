const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  enrollmentNo: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob: { type: Date, required: true },
  address: { type: String },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  year: { type: Number, required: true },
  status: { type: String, enum: ['Active', 'Inactive', 'Graduated', 'Dropped'], default: 'Active' },
  admissionDate: { type: Date, default: Date.now },
  photo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);
