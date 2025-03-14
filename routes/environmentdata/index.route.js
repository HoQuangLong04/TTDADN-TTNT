const envdatRoute = require('./envdat.router')

module.exports = (app) => {
    app.use("/envdat", envdatRoute);
}