const express = require('express')
const controller = require('../../Controllers/member/member.controller')
//const Otpcontroller = require('../../Controllers/client/Otp.controller')

const router = express.Router()

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/logout' , controller.logout)

module.exports = router;