const mqtt = require('mqtt');

const ADAFRUIT_USERNAME = process.env.USER_NAME_ADAFRUIT || 'YOUR_ADAFRUIT_USERNAME';
const ADAFRUIT_IO_KEY = process.env.APIKEY_ADAFRUIT || 'YOUR_ADAFRUIT_IO_KEY';
const MQTT_BROKER_URL = 'mqtts://io.adafruit.com';

const client = mqtt.connect(MQTT_BROKER_URL, {
  username: ADAFRUIT_USERNAME,
  password: ADAFRUIT_IO_KEY
});

client.on('connect', () => {
  console.log('Connected to Adafruit IO MQTT Broker!');

  const FEED_SUBSCRIBE = `${ADAFRUIT_USERNAME}/feeds/DAT_LED`;
  client.subscribe(FEED_SUBSCRIBE, (err) => {
    if (!err) {
      console.log(`Subscribed to feed: ${FEED_SUBSCRIBE}`);
    } else {
      console.error('Subscribe error:', err);
    }
  });
});



client.on('message', (topic, message) => {
  console.log(`Received message from ${topic}: ${message.toString()}`);
});

client.on('error', (error) => {
  console.error('MQTT error:', error);
});


function publishCommandLed(payload) {
  const FEED_PUBLISH = `${ADAFRUIT_USERNAME}/feeds/DAT_LED`;
  client.publish(FEED_PUBLISH, payload, (err) => {
    if (err) {
      console.error('Error publishing command:', err);
    } else {
      console.log(`Published payload: ${payload} to ${FEED_PUBLISH}`);
    }
  });
}



function publishCommandFan(payload) {
  const FEED_PUBLISH = `${ADAFRUIT_USERNAME}/feeds/DAT_FAN`;
  client.publish(FEED_PUBLISH, payload, (err) => {
    if (err) {
      console.error('Error publishing command:', err);
    } else {
      console.log(`Published payload: ${payload} to ${FEED_PUBLISH}`);
    }
  });
}


module.exports = {
  initMQTT: () => client,
  publishCommandLed,
  publishCommandFan
};
