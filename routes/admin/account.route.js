const express = require('express')
const controller = require('../../Controllers/admin/account.controller')
const router = express.Router()

router.post('/create' ,controller.create_admin_account)
router.post('/login' ,controller.login)
router.post('/logout' ,controller.logout)


module.exports = router;