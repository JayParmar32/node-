const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

exports.getDashboard = async (req, res) => {
    try {
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await Patient.countDocuments();
        const totalAppointments = await Appointment.countDocuments();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayAppointments = await Appointment.countDocuments({
            date: { $gte: today }
        });

        const recentAppointments = await Appointment.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('doctor')
            .populate('patient');

        res.render('dashboard', {
            title: 'Admin Dashboard',
            stats: {
                totalDoctors,
                totalPatients,
                totalAppointments,
                todayAppointments
            },
            recentAppointments
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
