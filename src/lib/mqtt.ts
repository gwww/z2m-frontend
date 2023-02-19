// @ts-ignore
import mqtt_client from 'u8-mqtt/esm/web/index';
import type {
    BridgeInfo,
    ConsolidatedDevice,
    Device,
    DeviceState,
    Dictionary,
    GenericObject,
} from '$lib/types';
import generateId from '$lib/utils/generateId';

import { writable, type Writable } from 'svelte/store';
export const bridge_info: Writable<BridgeInfo | undefined> = writable();
export const devices: Writable<ConsolidatedDevice[]> = writable([]);

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
    prefix: string;

    constructor(mqtt_server: string, auth: MQTTAuth | undefined = undefined, prefix: string) {
        this.server = mqtt_server;
        this.auth = auth;
        this.prefix = prefix;
        this.mqtt = mqtt_client({ on_live: this.on_live.bind(this) })
            .with_websock(this.server)
            .with_autoreconnect(5000);
        my_mqtt = this; // Cannot instantiate another instance of MQTT_handler
    }

    async on_live(_: U8Mqtt, is_reconnect: boolean) {
        await this.mqtt.connect(this.auth);
        console.log('MQTT connected...', is_reconnect ? 'reconnect' : '');
        this.mqtt.subscribe(`${this.prefix}/#`);
        this.mqtt
            .on_topic(
                `${this.prefix}/bridge/response/device/:cmd`,
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_bridge_response);
                }
            )
            .on_topic(
                `${this.prefix}/bridge/:cmd`,
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_bridge_msg);
                }
            )
            .on_topic(
                `${this.prefix}/:device/availability`,
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_availability_msg);
                }
            )
            .on_topic(
                `${this.prefix}/:device`,
                (pkt: any, params: Dictionary<string>, ctx: any) => {
                    this.handle_msg(pkt, params, ctx, this.handle_state_msg);
                }
            )
            .on_topic(`${this.prefix}/*`, (pkt: any, params: Dictionary<string>, ctx: any) => {
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

        let decoded: any;
        try {
            decoded = pkt.json();
        } catch {
            decoded = pkt.text();
        }
        handler(decoded, params);
        // console.log("Devices Composite Object...", get(devices))
    }

    handle_bridge_response(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('bridge response json', params, pkt)
        const transaction: string = <string>pkt.transaction;
        if (transaction) {
            outstanding.completeRequest(transaction, <string>pkt.error ?? '');
        }
    }

    handle_state_msg(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('state packet json', params, pkt)
        const device_name = params['device'];
        if (device_name === 'bridge') return;
        const state_pkt = pkt as unknown as DeviceState;

        devices.update((devs) => {
            const device = get_device_from_name(devs, device_name);
            if (device) device.state = state_pkt;
            return devs;
        });
    }

    handle_availability_msg(pkt: string, params: Dictionary<string>) {
        // console.log('avail packet binary', params, pkt)
        const device_name = params['device'];

        devices.update((devs) => {
            const device = get_device_from_name(devs, device_name);
            if (device) device.availability = pkt === 'online';
            return devs;
        });
    }

    handle_bridge_msg(pkt: GenericObject, params: Dictionary<string>) {
        // console.log('bridge packet json', params, pkt)
        const cmd = params['cmd'];
        if (cmd === 'devices') {
            const devices_pkt = pkt as unknown as Device[];

            devices.update((devs) => {
                devices_pkt.forEach((dev) => {
                    update_devices(devs, dev.ieee_address, { device: dev });
                });
                return devs;
            });
        } else if (cmd === 'info') {
            const bridge_info_pkt = pkt as unknown as BridgeInfo;
            bridge_info.set(bridge_info_pkt);

            devices.update((devs) => {
                devs = [];
                Object.keys(bridge_info_pkt.config.devices).forEach((ieee_addr) => {
                    const dev = {
                        ieee_address: ieee_addr,
                        config_info: bridge_info_pkt.config.devices[ieee_addr],
                    };
                    update_devices(devs, ieee_addr, dev);
                });
                return devs;
            });
        }
    }

    unhandled_msg(pkt: any, params: Dictionary<string>) {
        console.debug('unhandled packet:', params, pkt);
    }
}

const update_devices = (devices: ConsolidatedDevice[], ieee_addr: string, update: any) => {
    const idx = devices.findIndex((d) => d.ieee_address === ieee_addr);
    if (idx < 0) {
        devices.push(update);
    } else {
        devices[idx] = { ...devices[idx], ...update };
    }
};

const get_device_from_name = (
    devices: ConsolidatedDevice[],
    name: string
): ConsolidatedDevice | undefined => {
    return devices.find((d) => d.ieee_address === name || d.config_info?.friendly_name === name);
};

export async function rename(from: string, to: string, homeassistant_rename: boolean) {
    return send('bridge/request/device/rename', { from, to, homeassistant_rename });
}

export async function set_description(id: string, description: string) {
    return send('bridge/request/device/options', { id, options: { description } });
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
        const request = this.outstanding_requests[id];
        if (request) {
            this.removeRequest(id);
            clearTimeout(request.timer);
            if (error) {
                console.log(`completing Request ${id}  Error: ${error}`);
                request.reject(error);
            } else {
                console.log(`completing Request ${id}, success!}`);
                request.resolve(`Success, ${id} response received`);
            }
        }
    }

    createRequest(id: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.completeRequest(id, `Timeout waiting for ${id}`);
            }, 5000);
            this.addRequest(id, { timer, resolve, reject });
        });
    }
}

const outstanding = new MQTTOutstandingRequests();

async function send(topic: string, payload: GenericObject): Promise<string> {
    console.debug('MQTT send:', topic, payload);
    const transaction = generateId();
    await my_mqtt.mqtt.json_send(`${my_mqtt.prefix}/${topic}`, { ...payload, transaction });
    return outstanding.createRequest(transaction);
}
