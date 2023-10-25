const mongoose = require("mongoose");
const schema = mongoose.Schema({
    name :{
        type:String
    },
    mail:{
        type:String
    },
},{
    timestamps:true
});
module.exports = mongoose.model("users",schema);