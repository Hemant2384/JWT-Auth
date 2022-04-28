//async
const path = require('path')
const fsPromises = require('fs').promises

const fileOps = async() => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname,'files','text.txt'))
        console.log(data.toString());
        await fsPromises.writeFile(path.join(__dirname,'files','promise.txt'),data)
        await fsPromises.appendFile(path.join(__dirname,'files','promise.txt'),'\n\nNice to meet you')
        await fsPromises.rename(path.join(__dirname,'files','promise.txt'),path.join(__dirname,'files','newpromise.txt'))
        const newdata = await fsPromises.readFile(path.join(__dirname,'files','newpromise.txt'))
        console.log(newdata.toString());
    }catch(err){
        console.log(err);
    }
}

fileOps();

// fs.writeFile(path.join(__dirname,'files','newfile.txt'), "Hello world",(err)=>{
//     if(err) throw err;
//     console.log("Write complete");
//     fs.appendFile(path.join(__dirname,'files','newfile.txt'), "\n\nHello new world",(err)=>{
//         if(err) throw err;
//         console.log("Appned complete");
//     })
// })
