const usersDB = {
    users : require('../data/users.json'),
    setUsers : function (data) {this.users = data}
}
const fsPromises = require('fs').promises
const path = require('path')
const handlelogout = async (req,res) => {
    const cookies = req.cookies
 
    if(!cookies?.jwt) {
        return res.sendStatus(204) // no content
    } 
    const refreshtoken = cookies.jwt;

    //is refresh token in DB
    const foundusername = usersDB.users.find(person => person.refreshtoken === refreshtoken)
    if(!foundusername){
        //clear the cookie
        res.clearCookie('jwt',{httpOnly : true})
        return res.sendStatus(204);//no content
    }
    //same refresh token found and now we need to delete that in db

    const otherusers = usersDB.users.filter(person => person.refreshtoken !== foundusername.refreshtoken)
    const currentuser = {...foundusername, refreshtoken: ''};
    usersDB.setUsers([...otherusers,currentuser])
    await fsPromises.writeFile(
        path.join(__dirname,'..','data','users.json'),
        JSON.stringify(usersDB.users)
    )
    res.clearCookie('jwt',{httpOnly : true})
    res.sendStatus(204)
}

module.exports = {handlelogout}