const commandRoute = require('./command.router')

// const  authenticateToken  = require('../../middlewares/authUser.middleware')
// const authenticateTableBooking = require("../../middlewares/tableBooking.middleware")

module.exports = (app) => {
    app.use("/voice_recognition_system", commandRoute);
}