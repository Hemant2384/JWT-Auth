const express = require('express')
const router = express.Router();
const path = require('path')
const logout = require('../controller/logoutcontroller')

router.route('/').get(logout.handlelogout)

module.exports = router;