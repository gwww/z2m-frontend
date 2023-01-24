import type { Device, DeviceState } from '$lib/types'
import { writable } from 'svelte/store';

const devices_init: Device[] = []
export const devices = writable(devices_init);

const device_states_init: { [key: string]: DeviceState } = {}
export const device_states = writable(device_states_init);

const device_avail: { [key: string]: string } = {}
export const device_availability = writable(device_avail);
