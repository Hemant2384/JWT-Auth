const bcrypt = require('bcrypt')
const User = require('../data/User')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const handlelogin = async (req,res) => {
    const {user,pwd} = req.body
    if(!user || !pwd){
        return res.status(400).json({'message' : 'missing'})
    }   
    const foundusername = await User.findOne({username : user}).exec();
    if(!foundusername){
        return res.sendStatus(401);//Unauthorized
    }
    const match = await bcrypt.compare(pwd,foundusername.password)
    if(match){
        const roles = Object.values(foundusername.roles)
        //create jwt
        const accesstoken = jwt.sign(
            {
                "UserInfo" : {
                "username" : foundusername.username,
                "Roles" : roles
            }
        },
            `${process.env.ACCESS_TOKEN}`,
            {expiresIn : '15m'}
        )
        const refreshtoken = jwt.sign(
            {"username" : foundusername.username}, //payload
            `${process.env.REFRESH_TOKEN}`,
            {expiresIn : '1d'}
        )
        //Saving refresh token wth current user
        foundusername.refreshtoken = refreshtoken;
        const result = await foundusername.save();
        console.log(result);
        res.cookie('jwt',refreshtoken,{httpOnly : true, maxAge : 24*60*60*1000}); // not available to javascript, much secured
        res.json({accesstoken})
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handlelogin}