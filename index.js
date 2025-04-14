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

const sensorRoute = require('./routes/sensor/index.route');
const environmentRoute = require('./routes/environmentdata/index.route');
//const voskService = require('./services/voskService');
const app = express();
const port = process.env.PORT;
const mqttService = require('./services/mqqtService');

const sensorService = require('./services/sensorService');


const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const swaggerDocument = yamljs.load(path.resolve(__dirname, 'swagger.yaml'));

database.connect();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

clientRoute(app);
adminRoute(app);
smart_door_Route(app);
voice_recognition_system_Router(app);

sensorRoute(app);
environmentRoute(app);
// voskService.startListening();
mqttService.initMQTT();
sensorService.initMQTT();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

