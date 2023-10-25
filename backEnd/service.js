const schema = require("./schema");
const service = {
    get:()=>{
        return schema.find();
    },
    create:(newUser)=>{
        const createUser = new schema(newUser);
        return createUser.save();
    },
    getByName:(byName)=>{
        return schema.findOne(byName);
    }
}
module.exports = service;