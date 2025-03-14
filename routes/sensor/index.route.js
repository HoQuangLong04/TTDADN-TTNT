const sensorRoute = require('./sensor.router')

module.exports = (app) => {
    app.use("/sensor", sensorRoute);
}