const bcrypt = require('bcrypt')
const usersDB = {
    users : require('../data/users.json'),
    setUsers : function (data) {this.users = data}
}
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises
const path = require('path')

const handlelogin = async (req,res) => {
    const {user,pwd} = req.body
    if(!user || !pwd){
        return res.status(400).json({'message' : 'missing'})
    }   
    const foundusername = usersDB.users.find(person => person.username === user)
    if(!foundusername){
        return res.sendStatus(401);//Unauthorized
    }
    console.log(foundusername);
    const match = await bcrypt.compare(pwd,foundusername.password)
    console.log(match);
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
        const otherusers = usersDB.users.filter(person => person.username !== foundusername.username)
        const currentuser = {...foundusername, refreshtoken};
        usersDB.setUsers([...otherusers,currentuser])
        await fsPromises.writeFile(
            path.join(__dirname,'..','data','users.json'),
            JSON.stringify(usersDB.users)
        )
        res.cookie('jwt',refreshtoken,{httpOnly : true, maxAge : 24*60*60*1000}); // not available to javascript, much secured
        res.json({accesstoken})
    }else{
        res.sendStatus(401);
    }
}

module.exports = {handlelogin}