const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  dob: { type: Date },
  qualification: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  subjects: [{ type: String }],
  salary: { type: Number },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' },
  photo: { type: String, default: '' },
  address: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Faculty', FacultySchema);
