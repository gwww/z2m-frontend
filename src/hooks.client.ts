import { bridge_info, devices, device_available, device_states } from '$lib/stores';
import type { BridgeInfo, Device, DeviceState } from '$lib/types';
import { mqtt_env } from './mqtt_env.js'; // Private file with credentials in it
import * as mqtt from 'mqtt';

export const ssr = false;

// TODO: make topic configurable as opposed to fixed zigbee2mqtt
// server example: 'ws://192.168.1.1:1884'
let client = mqtt.connect(mqtt_env.server, {
    username: mqtt_env.user,
    password: mqtt_env.password,
});

client.on('connect', function() {
    console.log('MQTT connected!');
    client.subscribe('zigbee2mqtt/#', function(err, granted) {
        console.log('subscribe: ', err, granted);
    });
});

client.on('message', function(topic, message) {
    // console.log('Topic: ', topic);
    // if (!topic.startsWith('zigbee2mqtt/bridge/')) {
    //   console.log(message.toString())
    // }
    const comps = topic.split('/');
    if (comps.length < 2) return;
    if (comps[0] !== 'zigbee2mqtt') return;

    const msg = message.toString();
    let json_msg: DeviceState;
    try {
        json_msg = JSON.parse(msg);
    } catch { } // Nothing to do here

    // Is this a state update?
    if (comps.length === 2) {
        if (comps[1] === 'bridge') return;
        if (json_msg === undefined) return;

        const entity_name = comps[1];
        device_states.update((states) => {
            states[entity_name] = json_msg;
            return states;
        });
        return;
    }

    // 3 (or more) components in update message topic
    if (comps[1] === 'bridge') {
        const bridge_topic = comps[2];
        if (bridge_topic === 'devices') {
            if (json_msg === undefined) return;
            devices.set(json_msg as unknown as Device[]);
        } else if (bridge_topic === 'info') {
            if (json_msg === undefined) return;
            bridge_info.set(json_msg as unknown as BridgeInfo);
        }
        return;
    } else if (comps[2] === 'availability') {
        const entity_name = comps[1];
        device_available.update((avail) => {
            console.log(`availability for ${entity_name} set to ${msg}`);
            avail[entity_name] = msg === 'online';
            return avail;
        });
    }
});
