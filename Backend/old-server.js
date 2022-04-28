const path = require('path')
const http =  require('http')
const logevent = require('./logevent');
const fs = require('fs')
const fsPromises = require('fs').promises;

const eventemitter = require('events');
const { fi } = require('date-fns/locale');
class Emitter extends eventemitter { };
const myemitter = new Emitter();

myemitter.on('log' , (msg,fileName) => {
    logevent(msg,fileName)
})

const PORT = process.env.PORT || 3500;

const serveFile = async(filePath , contentType , response) => {
    try {
        const rawdata = await fsPromises.readFile(filePath, 'utf8');
        const data = contentType === 'application/json' ? JSON.parse(rawdata) : rawdata;
        response.writeHead(
            filePath.includes('404.html') ? 404 : 200,{
            'Content-type' : contentType
        })
        response.end(contentType === 'application/json' ? JSON.stringify(data) : data);
    }catch(err){
        console.log(err);
        myemitter.emit('log', `${err.name} : ${err.message}`,'errlog.txt') 
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req,res) => {
    console.log(req.url,req.method);

    myemitter.emit('log', `${req.url}\t${req.method}`,'reqlog.txt') 

    const extension = path.extname(req.url)

    let contentType;

    switch(extension){
        case 'css' : 
         contentType = 'text/css'
          break;
        case '.js' : 
         contentType = 'text/javascript'
          break;
        case '.json' : 
         contentType = 'application/json'
          break;
        case '.jpg' : 
         contentType = 'image/jpeg'
          break;
        case '.png' : 
          contentType = 'image/png'
          break;
        case '.txt' : 
          contentType = 'text/plain'
          break;
        default : 
         contentType = 'text/html'
         break;
    }

    let filePath;
    if(contentType==='text/html' && req.url==='/'){
        filePath = path.join(__dirname,'views','index.html')
    }
    else if(contentType==='text/html' && req.url.slice(-1)==='/'){
        filePath = path.join(__dirname,'views',req.url,'index.html')        
    }
    else if(contentType==="text/html"){
        filePath = path.join(__dirname,'views',req.url)
    }
    else{
        filePath = path.join(__dirname,req.url)
    }

    if(!extension && req.url.slice(-1)!=='/'){
        filePath+='.html';
    }

    const fileExists = fs.existsSync(filePath);

    if(fileExists){
        //serve
        serveFile(filePath,contentType,res);
    }
    else{
        switch(path.parse(filePath).base) {
            case 'old-page.html' : 
                  res.writeHead(301,{'Location' : '/new-page.html'})
                  res.end()
                  break;
            case 'www-page.html' : 
                  res.writeHead(301,{'Location' : '/'})
                  res.end()
                  break;
            default : 
                 serveFile(path.join(__dirname,'views','404.html'),'text/html',res);
                  break;
        }
    }
})

server.listen(PORT,() => console.log(`Server running on port ${PORT}`))



