import type { Device, DeviceState, Dictionary } from '$lib/types'
import { writable, type Writable } from 'svelte/store';

export const devices: Writable<Device[]> = writable([])
export const device_states: Writable<Dictionary<DeviceState>> = writable({})
export const device_available: Writable<Dictionary<boolean>> = writable({})
