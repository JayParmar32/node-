const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', patientController.index);
router.get('/add', patientController.renderAdd);
router.post('/add', patientController.add);
router.get('/edit/:id', patientController.renderEdit);
router.put('/edit/:id', patientController.edit);
router.delete('/delete/:id', patientController.delete);

module.exports = router;
