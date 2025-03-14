// Kết nối thử với adafruit
const mqtt = require('mqtt');
const doorDataController = require('../Controllers/smart_door/door.controller');

const MQTT_BROKER_URL = 'mqtts://io.adafruit.com';
const options = {
  username: '...........', // chỗ này thì thay bằng tên
  password: '...........',  // Chỗ này thay bằng API KEY của mình 
};

function initMQTT() {
  const client = mqtt.connect(MQTT_BROKER_URL, options);

  client.on('connect', () => {
    console.log('Kết nối tới Adafruit IO MQTT Broker thành công!');

    // feed để lấy dữ liệu 
    const FEED_TOPIC = 'David030204/feeds/DAT_LED';    // Thay chỗ này bằng đường dẫn đến feed
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
    const msg = message.toString(); 
    console.log(`Nhận message từ topic ${topic}: ${msg}`);
    doorDataController.getdoorData(msg);
  });

  client.on('error', (error) => {
    console.error('Lỗi kết nối MQTT:', error);
  });

  return client;
}

module.exports = { initMQTT };

