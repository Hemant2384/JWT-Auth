const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')
const usersDB = {
    users : require('../data/users.json'),
    setUsers : function (data) {this.users = data}
}

const handlenewuser = async (req,res) => {
    const {user,pwd} = req.body
    if(!user || !pwd){
        return res.status(400).json({'message' : 'missing'})
    }   
    const duplicate = usersDB.users.find(person => person.username === user)
    if(duplicate){
        res.sendStatus(409)
    }
    try{
        const hashedpwd = await bcrypt.hash(pwd,10)
        const newuser = {
            "username" : user,
            "roles" : {
                "User" : 2001
            },
            "password" : hashedpwd}
        console.log(newuser);
        usersDB.setUsers([...usersDB.users,newuser])
        await fsPromises.writeFile(
            path.join(__dirname,'..','data','users.json'),
            JSON.stringify(usersDB.users)
            );
        console.log(usersDB.users);
        res.status(201).json({'success' : `New user ${user} created`})
    }catch(err){
        res.status(500).json({'message' : err.message})
    }
}

module.exports = {handlenewuser};