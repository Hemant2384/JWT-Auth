const express = require('express')
const router = express.Router();
const path = require('path')

router.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'..','views','index.html'))
})
router.get('/new-page',(req,res) => {
    res.sendFile(path.join(__dirname,'..','views','new-page.html'))
})
router.get('/old-page',(req,res) => {
    res.redirect(301,'/new-page')
})

module.exports = router;