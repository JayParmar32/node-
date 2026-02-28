const express = require('express');
const db = require('./config/db');
const User = require('./model/userModel');
const app = express();

app.use(express.json());

app.post('/insertdata', async (req, res) => {
    const data =await User.create(req.body);
    res.send(data);
});

app.get('/', async (req, res) => {
    const data =await User.find();
    res.send(data);
});

app.delete('/:id', async (req, res) => { 
    const data =await User.findByIdAndDelete(req.params.id);
    res.send("success");
});

app.patch('/:id', async (req, res) => {
    const data =await User.findByIdAndUpdate(req.params.id,req.body);
    res.send("success");
});

app.listen(8000, () => {
  console.log('Server is running on port 8000');
});