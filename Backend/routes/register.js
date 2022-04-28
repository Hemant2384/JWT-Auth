const express = require('express')
const router = express.Router();
const path = require('path')
const registeruser = require('../controller/registercontroller')

router.route('/').post(registeruser.handlenewuser)

module.exports = router;