const doorRoute = require('./smart_door.router')

// const  authenticateToken  = require('../../middlewares/authUser.middleware')
// const authenticateTableBooking = require("../../middlewares/tableBooking.middleware")

module.exports = (app) => {
    app.use("/smart_door", doorRoute);
}