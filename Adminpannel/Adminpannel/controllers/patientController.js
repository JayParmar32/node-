const Patient = require('../models/Patient');

exports.index = async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });
        res.render('patients/index', { title: 'Manage Patients', patients });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.renderAdd = (req, res) => {
    res.render('patients/add', { title: 'Add Patient' });
};

exports.add = async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.redirect('/patients');
    } catch (err) {
        console.error(err);
        res.render('patients/add', { title: 'Add Patient', error: 'Failed to add patient' });
    }
};

exports.renderEdit = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).send('Patient not found');
        res.render('patients/edit', { title: 'Edit Patient', patient });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.edit = async (req, res) => {
    try {
        await Patient.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/patients');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

exports.delete = async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.redirect('/patients');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
