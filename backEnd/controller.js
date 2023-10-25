const service = require("./service");
const jwt = require("jsonwebtoken")
const controller = {
    getUsers:async(req,res)=>{
        try{
            const filter = await service.get();
                res.status(201);
                res.send({data:filter})
            
        }
        catch(err){
            res.status(500);
            res.send(console.log(err));
        }
    },
    createUser:async(req,res)=>{
        try{
            const filter = await service.getByName({mail:{$eq:req.body.mail}});
            if(filter){
                res.status(400);
                res.send({error:"conflict",Discription:"user alredy exists with this mail....!"})
            }
            else{
                const userCreated = await service.create(req.body);
                const userInfo = {
                    name:userCreated.name,
                    mail:userCreated.mail
                };
                const token = await jwt.sign(userInfo,"deePu");
                res.status(200);
                res.send({staus:"user got registered....!",data:token});
            }
        }
        catch(err){
            res.status(500);
            res.send(console.log(err.response));
        }
    },
}
module.exports = controller;