const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// const ejs = require('ejs');

dotenv.config();
connectDB();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use('/',require('./routes/productRoutes'));


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});