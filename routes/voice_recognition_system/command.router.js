const express = require("express");
const router = express.Router();
const controller = require("../../Controllers/voice_recognition_system/command.controller");


const authenticateToken = require("../../middlewares/authUser.middleware");
const authorizeRoles = require("../../middlewares/authRoles.middleware");


router.post("/add_command", authenticateToken, authorizeRoles(), controller.addCommand);



module.exports = router;
