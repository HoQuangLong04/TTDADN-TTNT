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


// // Đường dẫn tuyệt đối đến Python và script
// const pythonExe = "C:/Users/ACER/AppData/Local/Programs/Python/Python312/python.exe";
// const mlScript = "D:/Code_2025/Do_an_Tong_hop/Smart_home/AI/embed_service.py";

// // Kiểm tra file script tồn tại
// if (!fs.existsS3030ync(mlScript)) {
//   console.error('❌ Python script not found at:', mlScript);
//   process.exit(1);
// }

// // Khởi động ML service ngầm
// const mlProcess = spawn(pythonExe, [mlScript], {
//   cwd: path.dirname(mlScript),
//   detached: true,
//   stdio: ['ignore',  process.stdout, process.stderr]
// });
// mlProcess.unref();
// console.log('🚀 ML service started in background');


const pythonExe = "C:/Users/ACER/AppData/Local/Programs/Python/Python312/python.exe";
const mlScript = "D:/Code_2025/Do_an_Tong_hop/Smart_home/AI/embed_service.py";
const ML_PORT = 8000;

// Start FastAPI
async function startMLService() {
  if (!fs.existsSync(mlScript)) {
    console.error('❌ Python script not found at:', mlScript);
    process.exit(1);
  }
  const mlProcess = spawn(pythonExe, [mlScript], {
    cwd: path.dirname(mlScript),
    stdio: 'inherit',
    env: {
      ...process.env,       // giữ các biến môi trường hiện có
      PORT: '8000'          // ép ML service dùng PORT riêng biệt
    }
  });
  // const mlProcess = spawn(pythonExe, [mlScript], {
  //   cwd: path.dirname(mlScript),
  //   stdio: 'inherit' 
  //   // detached: true,
  //   // stdio: ['ignore', 'inherit', 'inherit']
  // });
  mlProcess.unref();
  console.log('🚀 ML service started in background');

  console.log('⏳ Waiting for ML service to be ready...');
  const portOpen = await waitPort({ host: 'localhost', port: ML_PORT, timeout: 30000 });
  if (portOpen) {
    console.log('✅ ML service is ready!');
  } else {
    console.error('❌ ML service failed to start.');
    process.exit(1);
  }
}

startMLService(); // Gọi ở đầu chương trình

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})





