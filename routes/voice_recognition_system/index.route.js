const commandRoute = require('./command.router')
const recordRoute = require('./record.router')

module.exports = (app) => {
    app.use("/voice_recognition_system", commandRoute, recordRoute);
}

