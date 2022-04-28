const bcrypt = require('bcrypt')
const User = require('../data/User')
const handlenewuser = async (req,res) => {
    const {user,pwd} = req.body
    if(!user || !pwd){
        return res.status(400).json({'message' : 'missing'})
    }   
    const duplicate = await User.findOne({username : user}).exec();// check for dupliactes in mongo
    if(duplicate){
        res.sendStatus(409)
    }
    try{
        const hashedpwd = await bcrypt.hash(pwd,10)
        //create and store a new user
        const result = await User.create({
            "username" : user,
            "password" : hashedpwd
        });
        console.log(result);
        res.status(201).json({'success' : `New user ${user} created`})
    }catch(err){
        res.status(500).json({'message' : err.message})
    }
}

module.exports = {handlenewuser};