const express = require("express");
const server = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = require("./Router");
const cors = require("cors");
server.listen(5000,()=>{
    console.log("Server connected ....!")
});
const Url = "mongodb+srv://pradeep9100234360:Deepu1625@cluster0.zyiyzx2.mongodb.net/Project"
mongoose.connect(Url).then(()=>{
    console.log("DB Connected....!")
}).catch((err)=>{
    console.log(err);
});
server.use(cors());
server.use(bodyParser.json());
server.use("/API/project",router);
