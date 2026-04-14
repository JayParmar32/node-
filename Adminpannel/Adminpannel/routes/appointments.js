const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', appointmentController.index);
router.get('/add', appointmentController.renderAdd);
router.post('/add', appointmentController.add);
router.get('/edit/:id', appointmentController.renderEdit);
router.put('/edit/:id', appointmentController.edit);
router.delete('/delete/:id', appointmentController.delete);

module.exports = router;
