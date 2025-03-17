// Kết nối thử với adafruit
const mqtt = require('mqtt');
const sensorController = require('../Controllers/sensor/sensor.controller');
const Sensor = require('../models/sensor.model');

const MQTT_BROKER_URL = 'mqtts://io.adafruit.com';
const options = {
  // username: 'HQL04',
  // password: '....................',
  username: process.env.USER_NAME_ADAFRUIT,
  password:  process.env.APIKEY_ADAFRUIT, 
};

function initMQTT() {
  const client = mqtt.connect(MQTT_BROKER_URL, options);  

  client.on('connect', () => {
    console.log('Kết nối tới Adafruit IO MQTT Broker thành công!');

    // feed để lấy dữ liệu 
    const FEED_TOPIC = 'HQL04/feeds/sensorfeed';    // Thay chỗ này bằng đường dẫn đến feed
    client.subscribe(FEED_TOPIC, (err) => {
      if (!err) {
        console.log(`Đã subscribe tới feed: ${FEED_TOPIC}`);
      } else {
        console.error('Lỗi subscribe:', err);
      }
    });
  });

  // Nhận dữ liệu từ Adafruit IO và truyền vào controller
  client.on('message', (topic, message) => {
    // const msg = message.toString(); 
    const msg = JSON.parse(message.toString());
    console.log(typeof(msg))
    console.log(`Nhận message từ topic ${topic}:`, msg);

    // console.log(message)
    // console.log(`Nhận message từ topic ${topic}`);
    obj = {
      value: msg,
      sensorID: "67d45b1719e9abfbc1e91ad2", //sau này thế cái khác vào
      systemID: "123456789012345678901234"
    }
    sensorController.getsensorData(obj);
  });

  client.on('error', (error) => {
    console.error('Lỗi kết nối MQTT:', error);
  });

  return client;
}

module.exports = { initMQTT };

