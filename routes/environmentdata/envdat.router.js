const express   = require('express')
const controller    = require('../../Controllers/environmentdata/envdat.controller')

const router = express.Router()


router.post('/adddata', controller.addData)

router.get('/getdata', controller.getData)

router.delete('/deletedata', controller.deleteData)

router.put('/updatedata', controller.updateData)

module.exports = router;