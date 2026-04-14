const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

exports.index = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctor')
            .populate('patient')
            .sort({ date: -1, time: 1 });
        res.render('appointments/index', { title: 'Manage Appointments', appointments });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.renderAdd = async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: 'Active' });
        const patients = await Patient.find();
        res.render('appointments/add', { title: 'Schedule Appointment', doctors, patients });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.add = async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        const doctors = await Doctor.find({ status: 'Active' });
        const patients = await Patient.find();
        res.render('appointments/add', { title: 'Schedule Appointment', doctors, patients, error: 'Failed to schedule appointment' });
    }
};

exports.renderEdit = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        const doctors = await Doctor.find({ status: 'Active' });
        const patients = await Patient.find();
        if (!appointment) return res.status(404).send('Appointment not found');
        res.render('appointments/edit', { title: 'Edit Appointment', appointment, doctors, patients });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.edit = async (req, res) => {
    try {
        await Appointment.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.delete = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.redirect('/appointments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
