const monogoose = require('mongoose');
const Schema = new monogoose.Schema({
    username:{
        type:String,
    },
    password:{
        type:String,
    },
});
const User = monogoose.model("User",Schema);
module.exports = User;