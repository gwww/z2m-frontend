// import { MQTT_SERVER_URI, MQTT_USERNAME, MQTT_PASSWORD } from '$env/static/private';
import * as mqtt from 'mqtt';

export const ssr = false;

import { devices } from '$lib/stores'

// if (process.env.MQTT_SERVER_URI === null) {
//   console.log('MQTT URI not specified in .env')
//   // exit...
// }

console.log('MQTT connecting...')
// let client = mqtt.connect(
//   MQTT_SERVER_URI!, { username: MQTT_USERNAME, password: MQTT_PASSWORD });
let client = mqtt.connect(
  'ws://192.168.1.1:1884', { username: '', password: '' });

client.on('connect', function() {
  console.log('MQTT connected!')
  client.subscribe('zigbee2mqtt/#', function(err, granted) {
    console.log('subscribe: ', err, granted)
  });
})

client.on('message', function(topic, message) {
  console.log('Topic: ', topic);

  if (!topic.startsWith('zigbee2mqtt/bridge/')) {
    console.log(message.toString())
  }
  if (topic === 'zigbee2mqtt/bridge/devices') {
    devices.set(JSON.parse(message.toString()))
  }
});
