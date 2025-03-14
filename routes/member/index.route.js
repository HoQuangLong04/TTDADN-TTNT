const userRoute = require('./member.route')

// const  authenticateToken  = require('../../middlewares/authUser.middleware')
// const authenticateTableBooking = require("../../middlewares/tableBooking.middleware")

module.exports = (app) => {
    app.use("/member", userRoute);
}