// @ts-ignore
import mqtt_client from 'u8-mqtt/esm/web/index';
import type { BridgeInfo, Device, DeviceState, Dictionary, GenericObject } from '$lib/types';
import generateId from '$lib/utils/generateId'

import { writable, type Writable } from 'svelte/store';
export const bridge_info: Writable<BridgeInfo | undefined> = writable();
export const devices: Writable<Device[]> = writable([]);
export const device_states: Writable<Dictionary<DeviceState>> = writable({});
export const device_available: Writable<Dictionary<boolean>> = writable({});

let my_mqtt: MQTT_handler;

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
        my_mqtt = this // Cannot instantiate another instance of MQTT_handler
    }

    async on_live(_: U8Mqtt, is_reconnect: boolean) {
        await this.mqtt.connect(this.auth);
        console.log('MQTT connected...')
        this.mqtt.subscribe('zigbee2mqtt/#');
        this.mqtt
            .on_topic(
                'zigbee2mqtt/bridge/response/device/:cmd',
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_bridge_response)
                }
            )
            .on_topic(
                'zigbee2mqtt/bridge/:cmd',
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_bridge_msg);
                }
            )
            .on_topic(
                'zigbee2mqtt/:device/availability',
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_availability_msg);
                }
            )
            .on_topic('zigbee2mqtt/:device', (pkt: any, params: Dictionary<string>, ctx: any) => {
                this.handle_msg(pkt, params, ctx, this.handle_state_msg);
            })
            .on_topic('zigbee2mqtt/*', (pkt: any, params: Dictionary<string>, ctx: any) => {
                this.handle_msg(pkt, params, ctx, this.unhandled_msg);
            });
    }

    handle_msg(
        pkt: any,
        params: Dictionary<string>,
        ctx: any,
        handler: (decoded: any, params: Dictionary<string>) => void
    ) {
        // console.log(pkt.topic, params)
        ctx.done = true; // Stops matches on further topics
        try {
            handler(pkt.json(), params);
        } catch {
            try {
                handler(pkt.text(), params);
            } catch { } // Either a bad packet or one that we don't know how to decode; ignore it.
        }
    }

    handle_bridge_response(pkt: GenericObject, params: Dictionary<string>) {
        console.log('bridge response json', params, pkt)
        const transaction: string = <string>pkt.transaction
        if (transaction) {
            outstanding.completeRequest(transaction, <string>pkt.error ?? '')
        }
    }

    handle_state_msg(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('state packet json', params, pkt)
        const device_name = params['device'];
        if (device_name === 'bridge') return;

        device_states.update((states) => {
            states[device_name] = pkt as DeviceState;
            return states;
        });
        return;
    }

    handle_availability_msg(pkt: string, params: Dictionary<string>) {
        // console.log('avail packet binary', params, pkt)
        const device_name = params['device'];
        device_available.update((avail) => {
            avail[device_name] = pkt === 'online';
            return avail;
        });
    }

    handle_bridge_msg(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('bridge packet json', params, pkt)
        const cmd = params['cmd'];
        if (cmd === 'devices') {
            devices.set(pkt as unknown as Device[]);
        } else if (cmd === 'info') {
            bridge_info.set(pkt as unknown as BridgeInfo);
        }
    }

    unhandled_msg(pkt: any, params: Dictionary<string>) {
        console.log('unhandled packet:', params, pkt);
    }
}

export async function rename(from: string, to: string, homeassistant_rename: boolean) {
    return send('bridge/request/device/rename', { from, to, homeassistant_rename })
}

export async function set_description(id: string, description: string) {
    return send('bridge/request/device/options', { id, "options": { description } })
}

interface Request {
    timer: any;
    resolve: any;
    reject: any;
}

class MQTTOutstandingRequests {
    outstanding_requests: Dictionary<Request> = {};

    addRequest(id: string, req: Request) {
        this.outstanding_requests[id] = req;
    }

    removeRequest(id: string) {
        delete this.outstanding_requests[id];
    }

    completeRequest(id: string, error: string) {
        const request = this.outstanding_requests[id]
        if (request) {
            this.removeRequest(id)
            clearTimeout(request.timer)
            if (error) {
                console.log(`completing Request ${id}  Error: ${error}`)
                request.reject(error)
            } else {
                console.log(`completing Request ${id}, success!}`)
                request.resolve(`Success, ${id} response received`)
            }
        }
    }

    createRequest(id: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.completeRequest(id, `Timeout waiting for ${id}`)
            }, 5000)
            this.addRequest(id, { timer, resolve, reject })
        })
    }
}

const outstanding = new MQTTOutstandingRequests()

async function send(topic: string, payload: GenericObject): Promise<string> {
    console.debug('MQTT send:', topic, payload)
    const transaction = generateId()
    await my_mqtt.mqtt.json_send(`zigbee2mqtt/${topic}`, { ...payload, transaction })
    return outstanding.createRequest(transaction)
}
