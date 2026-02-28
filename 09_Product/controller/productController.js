const Product = require('../model/productModel');


exports.getAllProducts = async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('index', { products });
}
exports.createPage = async (req, res) => {
    res.render('create');
}

exports.createProduct = async (req, res) => {
    await Product.create({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        stock: req.body.stock,
        image: req.file ? req.file.filename : null,
    });
    res.redirect('/');      
};
