import { MQTT_SERVER_URI, MQTT_USERNAME, MQTT_PASSWORD } from '$env/static/private';
import * as mqtt from 'mqtt';

export let devices: string = '';

if (process.env.MQTT_SERVER_URI === null) {
  console.log('MQTT URI not specified in .env')
  // exit...
}

let client = mqtt.connect(
  MQTT_SERVER_URI!, { username: MQTT_USERNAME, password: MQTT_PASSWORD });

client.on('connect', function() {
  client.subscribe('zigbee2mqtt/#', function(err, granted) {
    console.log('subscribe: ', err, granted)
  });
})

client.on('message', function(topic, message) {
  console.log(topic);

  if (topic === 'zigbee2mqtt/bridge/devices') {
    devices = message.toString()
  }
});
