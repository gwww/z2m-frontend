// @ts-ignore
import mqtt_client from 'u8-mqtt/esm/web/index';
import type { BridgeInfo, Device, DeviceState, Dictionary, GenericObject } from '$lib/types';
import generateId from '$lib/utils/generateId'

import { writable, type Writable } from 'svelte/store';
export const bridge_info: Writable<BridgeInfo | undefined> = writable();
export const devices: Writable<Device[]> = writable([]);
export const device_states: Writable<Dictionary<DeviceState>> = writable({});
export const device_available: Writable<Dictionary<boolean>> = writable({});
export const mqtt: Writable<MQTT_handler | undefined> = writable()

export interface MQTTAuth {
    username: string;
    password: string;
}
type U8Mqtt = any;

export class MQTT_handler {
    mqtt: U8Mqtt;
    server: string;
    auth: MQTTAuth | undefined;

    constructor(mqtt_server: string, auth: MQTTAuth | undefined = undefined) {
        this.server = mqtt_server;
        this.auth = auth;
        this.mqtt = mqtt_client({ on_live: this.on_live.bind(this) })
            .with_websock(this.server)
            .with_autoreconnect(5000)
    }

    async on_live(_: U8Mqtt, is_reconnect: boolean) {
        if (is_reconnect) {
            console.log('reconnecting...')
            await this.connect()
        }
    }

    async connect() {
        console.log('connect...')
        await this.mqtt.connect(this.auth);
        console.log('connected...')
        this.mqtt.subscribe('zigbee2mqtt/#');
        this.mqtt
            .on_topic(
                'zigbee2mqtt/bridge/:cmd',
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_pkt(pkt, params, ctx, this.handle_bridge_pkt);
                }
            )
            .on_topic(
                'zigbee2mqtt/:device/availability',
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_pkt(pkt, params, ctx, this.handle_availability_pkt);
                }
            )
            .on_topic('zigbee2mqtt/:device', (pkt: any, params: Dictionary<string>, ctx: any) => {
                this.handle_pkt(pkt, params, ctx, this.handle_state_pkt);
            })
            .on_topic('zigbee2mqtt/*', (pkt: any, params: Dictionary<string>, ctx: any) => {
                this.handle_pkt(pkt, params, ctx, this.unhandled_pkt);
            });
    }

    handle_pkt(
        pkt: any,
        params: Dictionary<string>,
        ctx: any,
        handler: (decoded: any, params: Dictionary<string>) => void
    ) {
        // console.log(pkt.topic, params)
        ctx.done = true;
        try {
            handler(pkt.json(), params);
        } catch {
            try {
                handler(pkt.text(), params);
            } catch {
                // Either a bad packet or one that we don't know how to decode; ignore it.
            }
        }
    }

    handle_state_pkt(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('state packet json', params, pkt)
        const device_name = params['device'];
        if (device_name === 'bridge') return;

        device_states.update((states) => {
            states[device_name] = pkt as DeviceState;
            return states;
        });
        return;
    }

    handle_availability_pkt(pkt: string, params: Dictionary<string>) {
        // console.log('avail packet binary', params, pkt)
        const device_name = params['device'];
        device_available.update((avail) => {
            avail[device_name] = pkt === 'online';
            return avail;
        });
    }

    handle_bridge_pkt(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('bridge packet json', params, pkt)
        const cmd = params['cmd'];
        if (cmd === 'devices') {
            devices.set(pkt as unknown as Device[]);
        } else if (cmd === 'info') {
            bridge_info.set(pkt as unknown as BridgeInfo);
        }
    }

    unhandled_pkt(pkt: any, params: Dictionary<string>) {
        console.log('unhandled packet:', params, pkt);
    }
}

let my_mqtt: MQTT_handler;
export function set_client(client: MQTT_handler) {
    my_mqtt = client;
}

export async function rename(from: string, to: string, home_assistant_rename: boolean) {
    console.log('MQTT rename:', from, to, home_assistant_rename)
    await my_mqtt.mqtt.json_send(
        'zigbee2mqtt/bridge/request/device/rename',
        { from, to, home_assistant_rename, transaction: generateId() }
    )
}

export async function set_description(id: string, from: string, to: string) {
    console.log('MQTT set_description:', id, from, to)
    await my_mqtt.mqtt.json_send(
        'zigbee2mqtt/bridge/response/device/options',
        {
            "id": "Aqara NEW TEST",
            "from": { "description": from, "legacy": true, "retain": true },
            "to": { "description": to, "legacy": true, "retain": true },
        }
    )
}

// Experimental //////////////////
// export class awaitMQTTResponse {
//     promise: Promise<any>;
//     resolve: any;
//
//     constructor(msg: any, timeout: number = 5000) {
//         this.promise = new Promise((resolve, reject) => {
//             setTimeout(() => {
//                 reject('Timeout!!!');
//             }, timeout);
//             this.resolve = resolve;
//         });
//     }
// }
//
// function asyncAction() {
//     var dfd = new awaitMQTTResponse('foo', 100);
//
//     setTimeout(() => {
//         dfd.resolve(42);
//     }, Math.floor(Math.random() * 150));
//
//     return dfd.promise;
// }
//
// asyncAction().then(
//     (result) => {
//         console.log(result);
//     },
//     (result) => {
//         console.log(result);
//     }
// );
