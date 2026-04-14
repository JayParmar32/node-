const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { requireAuth } = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', doctorController.index);
router.get('/add', doctorController.renderAdd);
router.post('/add', doctorController.add);
router.get('/edit/:id', doctorController.renderEdit);
router.put('/edit/:id', doctorController.edit);
router.delete('/delete/:id', doctorController.delete);

module.exports = router;
