const express = require('express')
const router = express.Router();
const path = require('path')
const authcontroller = require('../controller/authcontroller')

router.route('/').post(authcontroller.handlelogin)

module.exports = router;