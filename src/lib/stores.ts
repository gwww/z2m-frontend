import { writable } from 'svelte/store';

export type MQTTrecord = Record<string, unknown>
const init: MQTTrecord[] = [];

export const devices = writable(init);
