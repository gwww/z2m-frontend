import { devices } from '$lib/stores'
import { mqtt_env } from './mqtt_env.js'
import * as mqtt from 'mqtt';

export const ssr = false;

// server example: 'ws://192.168.1.1:1884'
let client = mqtt.connect(mqtt_env.server, { username: mqtt_env.user, password: mqtt_env.password });

client.on('connect', function() {
  console.log('MQTT connected!')
  client.subscribe('zigbee2mqtt/#', function(err, granted) {
    console.log('subscribe: ', err, granted)
  });
})

client.on('message', function(topic, message) {
  // console.log('Topic: ', topic);
  if (!topic.startsWith('zigbee2mqtt/bridge/')) {
    // console.log(message.toString())
  }

  if (topic === 'zigbee2mqtt/bridge/devices') {
    console.log("Updating store with devices")
    devices.set(JSON.parse(message.toString()))
  }
});
