// @ts-ignore
import mqtt_client from 'u8-mqtt/esm/web/index'
import type { BridgeInfo, Device, DeviceState, Dictionary, GenericObject } from '$lib/types';
import { mqtt_env } from '../mqtt_env.js'; // Private file with credentials in it

// import { bridge_info, devices, device_available, device_states } from '$lib/stores';
import { writable, type Writable } from 'svelte/store';
export const bridge_info: Writable<BridgeInfo | undefined> = writable()
export const devices: Writable<Device[]> = writable([]);
export const device_states: Writable<Dictionary<DeviceState>> = writable({});
export const device_available: Writable<Dictionary<boolean>> = writable({});

import { browser } from '$app/environment';

export interface MQTTAuth {
  username: string;
  password: string;
}

export class MQTT {
  mqtt: any;

  constructor(mqtt_server: string) {
    this.mqtt = mqtt_client()
      .with_websock(mqtt_server)
      .with_autoreconnect()
  }

  async connect(auth: MQTTAuth | undefined = undefined) {
    await this.mqtt.connect(auth)

    this.mqtt.subscribe('zigbee2mqtt/#')

    this.mqtt
      .on_topic('zigbee2mqtt/bridge/:cmd', (pkt: any, params: Dictionary<string>, ctx: any) => {
        this.handle_pkt(pkt, params, ctx, this.handle_bridge_pkt)
      })
      .on_topic('zigbee2mqtt/:device/availability', (pkt: any, params: Dictionary<string>, ctx: any) => {
        this.handle_pkt(pkt, params, ctx, this.handle_availability_pkt)
      })
      .on_topic('zigbee2mqtt/:device', (pkt: any, params: Dictionary<string>, ctx: any) => {
        this.handle_pkt(pkt, params, ctx, this.handle_state_pkt)
      })
      .on_topic('zigbee2mqtt/*', (pkt: any, params: Dictionary<string>, ctx: any) => {
        this.handle_pkt(pkt, params, ctx, this.unhandled_pkt)
      })
  }

  handle_pkt(pkt: any, params: Dictionary<string>, ctx: any, handler: (decoded: any, params: Dictionary<string>) => void) {
    // console.log(pkt.topic, params)
    ctx.done = true;
    try {
      const json_msg = pkt.json();
      handler(json_msg, params);
    } catch {
      handler(new TextDecoder().decode(pkt.payload), params)
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
    const cmd = params['cmd']
    if (cmd === 'devices') {
      devices.set(pkt as unknown as Device[]);
    } else if (cmd === 'info') {
      bridge_info.set(pkt as unknown as BridgeInfo);
    }
  }

  unhandled_pkt(pkt: any, params: Dictionary<string>) {
    console.log('unhandled packet:', params, pkt)
  }
}

if (browser) {
  const mqtt = new MQTT(mqtt_env.server)
  mqtt.connect({
    username: mqtt_env.user,
    password: mqtt_env.password,
  })
}

