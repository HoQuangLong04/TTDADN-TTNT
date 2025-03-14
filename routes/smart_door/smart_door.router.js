const express = require('express')
const controller = require('../../Controllers/smart_door/door.controller')
const  authenticateToken  = require('../../middlewares/authUser.middleware')
const authorizeRoles = require('../../middlewares/authRoles.middleware')

const router = express.Router()


router.post('/set_door_password',authenticateToken, controller.setDoorPassword)

router.post('/access',authenticateToken, controller.accessDoor)

router.post('/changeDoorPassword',authenticateToken, authorizeRoles(), controller.changeDoorPassword)


module.exports = router;