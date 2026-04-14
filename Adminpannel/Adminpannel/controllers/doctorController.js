const Doctor = require('../models/Doctor');

exports.index = async (req, res) => {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });
        res.render('doctors/index', { title: 'Manage Doctors', doctors });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.renderAdd = (req, res) => {
    res.render('doctors/add', { title: 'Add Doctor' });
};

exports.add = async (req, res) => {
    try {
        const newDoctor = new Doctor(req.body);
        await newDoctor.save();
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.render('doctors/add', { title: 'Add Doctor', error: 'Failed to add doctor' });
    }
};

exports.renderEdit = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) return res.status(404).send('Doctor not found');
        res.render('doctors/edit', { title: 'Edit Doctor', doctor });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.edit = async (req, res) => {
    try {
        await Doctor.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.delete = async (req, res) => {
    try {
        await Doctor.findByIdAndDelete(req.params.id);
        res.redirect('/doctors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
