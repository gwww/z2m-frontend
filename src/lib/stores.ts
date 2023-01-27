import type { BridgeInfo, Device, DeviceState, Dictionary } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export const bridge_info: Writable<BridgeInfo | undefined> = writable()
export const devices: Writable<Device[]> = writable([]);
export const device_states: Writable<Dictionary<DeviceState>> = writable({});
export const device_available: Writable<Dictionary<boolean>> = writable({});
