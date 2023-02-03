// @ts-ignore
import mqtt_client from 'u8-mqtt/esm/web/index';
import type { BridgeInfo, Device, DeviceState, Dictionary, GenericObject } from '$lib/types';

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
        this.mqtt = mqtt_client({
            on_live: (client: U8Mqtt, is_reconnect: boolean) => {
                if (is_reconnect) {
                    this.connect()
                }
            },
        })
            .with_websock(this.server)
            .with_autoreconnect(2500,
                () => { console.log('reconnect in auto reconnect') },
                () => { console.log('error in auto reconnect') }
            )
    }

    async connect() {
        console.log('MQTT connect')
        await this.mqtt.connect(this.auth);
        console.log('MQTT connected!')
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
        console.log(pkt.topic, params)
        ctx.done = true;
        try {
            const json_msg = pkt.json();
            handler(json_msg, params);
        } catch {
            handler(pkt.text(), params);
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
