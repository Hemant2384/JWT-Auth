const User = require('../data/User')
const handlelogout = async (req,res) => {
    const cookies = req.cookies
 
    if(!cookies?.jwt) {
        return res.sendStatus(204) // no content
    } 
    const refreshtoken = cookies.jwt;

    //is refresh token in DB
    const foundusername = await User.findOne({refreshtoken}).exec();
    if(!foundusername){
        //clear the cookie
        res.clearCookie('jwt',{httpOnly : true})
        return res.sendStatus(204);//no content
    }
    //same refresh token found and now we need to delete that in db
    foundusername.refreshtoken = '';
    const result = await foundusername.save();
    console.log(result);
    res.clearCookie('jwt',{httpOnly : true})
    res.sendStatus(204)
}

module.exports = {handlelogout}