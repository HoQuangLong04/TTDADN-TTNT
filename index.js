const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config();
require('dotenv').config();
const database = require('./config/mongoDB.database');

const clientRoute = require('./routes/member/index.route');
const adminRoute = require('./routes/admin/index.route');
const smart_door_Route = require('./routes/smart_door/index.route');
const voice_recognition_system_Router = require('./routes/voice_recognition_system/index.route')

const app = express();
const port = process.env.PORT;
const mqttService = require('./services/mqqtService');


database.connect();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

clientRoute(app);
adminRoute(app);
smart_door_Route(app);
voice_recognition_system_Router(app);

mqttService.initMQTT();

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

