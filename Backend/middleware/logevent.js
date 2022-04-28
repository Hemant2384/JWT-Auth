const {format} = require('date-fns')
const {v4 : uuid} = require('uuid');

const fs = require('fs')

const fsPromises = require('fs').promises;

const path = require('path')

const logevent = async(message,logname) => {
    const datetime = `${format(new Date(), 'yyyyMMdd\tHH:mm::ss')}`
    const logitem = `${datetime}\t${uuid()}\t${message}\n`
    console.log(logitem);
    try{
        if(!fs.existsSync(path.join(__dirname,'..','logs'))){
            await fsPromises.mkdir(path.join(__dirname,'..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname,'..','logs',logname),logitem)
    }catch(err){
        console.log(err);
    }
}

module.exports = logevent;