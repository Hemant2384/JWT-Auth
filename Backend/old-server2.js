const path = require('path')
const express = require('express')
const cors = require('cors')
const logevent = require('./middleware/logevent')
const error = require('./middleware/errorHandle')
const app = express();
const PORT = process.env.PORT || 3500;


//builtin middleware
app.use(express.static(path.join(__dirname,'/public')))
app.use('/subdir',express.static(path.join(__dirname,'/public')))
app.use('/employees',express.static(path.join(__dirname,'/public')))
app.use('/',require('./routes/root'))
app.use('/subdir',require('./routes/subdir'));
app.use('/employees',require('./routes/api/employees'));

//cutsom middleware logger
app.use((req,res,next) => {
    logevent(`${req.method}\t${req.headers.origin}\t${req.url}`,'reqlog.txt')
    next();
})

//cross origin resource sharing
//third party middleware
const whitelist = ['https://www.google.com']

const corsOption = {
    origin : (origin,callback) => {
        if(whitelist.indexOf(origin)!==-1 || !origin){
            callback(null,true)
        }else{
            callback(new Error('Not Allowed by Cors'))
        }
    },
    optionsSuccessStatus : 200
}

app.use(cors(corsOption));

const one = (req,res,next) => {
    console.log('one');
    next();
}
const two = (req,res,next) => {
    console.log('two');
    next();
}
const three = (req,res) => {
    console.log('three');
    res.send('Finished')
}

app.get('/chain',[one, two, three])
app.get('/*',(req,res) => {
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})

app.use(error)

app.listen(PORT,() => console.log(`Server running on port ${PORT}`))



