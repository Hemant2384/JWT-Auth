const logevent = require('./logevent')

const error = (err,req,res,next) => {
    logevent(`${err.name} : ${err.message}`,'errlog.txt')
    console.log(err.stack);
    res.status(500).send(err.message)
}

module.exports = error;