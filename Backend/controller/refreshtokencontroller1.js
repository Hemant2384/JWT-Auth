const usersDB = {
    users : require('../data/users.json'),
    setUsers : function (data) {this.users = data}
}
const jwt = require('jsonwebtoken')
const handlerefreshtoken = (req,res) => {
    const cookies = req.cookies
    console.log(cookies.jwt);
    if(!cookies?.jwt) {
        return res.sendStatus(401)
    } 
    const refreshtoken = cookies.jwt;
    const foundusername = usersDB.users.find(person => person.refreshtoken === refreshtoken)
    if(!foundusername){
        return res.sendStatus(403);//Forbidden
    }
    jwt.verify(
        refreshtoken,
        `${process.env.REFRESH_TOKEN}`,
        (err,decoded) => {
            if(err || foundusername.username!==decoded.username) {
                return res.sendStatus(403)
            }
            const roles = Object.values(foundusername.roles)
            const accessToken = jwt.sign (
                {
                    "UserInfo" : {
                    "username" : decoded.username,
                    "Roles" : roles
                }
            },
                `${process.env.ACCESS_TOKEN}`,
                {expiresIn : '30s'}
            )
            res.json({accessToken})
        }
    )
}

module.exports = {handlerefreshtoken}