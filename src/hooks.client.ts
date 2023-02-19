import { MQTT_handler } from '$lib/mqtt';
import { browser } from '$app/environment';
import { mqtt_env } from './mqtt_env.js'; // Private file with credentials in it
import 'uno.css';

if (browser) {
    new MQTT_handler(
        mqtt_env.server,
        {
            username: mqtt_env.user,
            password: mqtt_env.password,
        },
        'zigbee2mqtt'
    );
}
