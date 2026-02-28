const express = require('express');
const router = express.Router();
const upload = require('../middleware/productMiddleware');
const productController = require('../controller/productController');

router.get('/', productController.getAllProducts);
router.get('/create', productController.createPage);
// router.post('/create', upload.single('image'), createProduct);
router.post('/create', upload.single('image'), productController.createProduct);



module.exports = router;