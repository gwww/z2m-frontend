import { MQTT_handler, mqtt } from '$lib/mqtt';
import { browser } from '$app/environment';
import { mqtt_env } from './mqtt_env.js'; // Private file with credentials in it

if (browser) {
  const client = new MQTT_handler(mqtt_env.server, {
    username: mqtt_env.user,
    password: mqtt_env.password,
  });
  await client.connect()
  mqtt.set(client)
}
