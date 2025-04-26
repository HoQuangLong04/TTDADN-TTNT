const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config();
require('dotenv').config();
const database = require('./config/mongoDB.database');

const { spawn } = require('child_process');
const waitPort = require('wait-port');
const fs = require('fs');
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




// Đoạn này nó đang khởi động 1 dịch vụ Python trên background khi chương trình chạy (chạy nầm cái fastapifastapi)
const pythonExe = process.env.PYTHON_PATH;
// đường dẫn tới file embed_service.py
const mlScript = process.env.ML_SCRIPT_PATH;
const ML_PORT = 8000;
async function startMLService() {
  if (!fs.existsSync(mlScript)) {
    console.error('Python script not found at:', mlScript);  
    process.exit(1);
  }
  const mlProcess = spawn(pythonExe, [mlScript], {
    cwd: path.dirname(mlScript),
    stdio: 'inherit',
    env: {
      ...process.env,       
      PORT: '8000'         
    }
  });
  mlProcess.unref();
  console.log('ML service started in background');
  console.log('Waiting for ML service to be ready...');
  const portOpen = await waitPort({ host: 'localhost', port: ML_PORT, timeout: 30000 });
  if (portOpen) {
    console.log('ML service is ready!');
  } else {
    console.error('ML service failed to start.');
    process.exit(1);
  }
}
startMLService(); 

app.listen(port, () => {
  console.log(`App listening on port ${port}`);

  // API doc 
   console.log(`API Docs (Swagger) available at: http://localhost:${port}/api-docs`);
})





