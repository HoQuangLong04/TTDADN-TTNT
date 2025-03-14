const express   = require('express')
const controller    = require('../../Controllers/sensor/sensor.controller')

const router = express.Router()


router.post('/addsensor', controller.addSensor)

router.get('/getsensor', controller.getSensor)

router.delete('/deletesensor', controller.deleteSensor)

router.put('/updatesensor', controller.updateSensor)

// router.post('/changeDoorPassword', controller.changeDoorPassword)


module.exports = router;