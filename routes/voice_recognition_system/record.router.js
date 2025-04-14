const express = require('express');
const router = express.Router();
const recordController = require("../../Controllers/voice_recognition_system/record.controller");


router.post('/start-recording', recordController.startRecording);

module.exports = router;
