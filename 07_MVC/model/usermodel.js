const mongoose = require("mongoose")
const userDemo = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    }
})

const userModel = new mongoose.model("demo",userDemo)

module.exports=userModel