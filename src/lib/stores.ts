import type { Device } from '$lib/types'
import { writable } from 'svelte/store';

const init: Device[] = []
export const devices = writable(init);

export const state = writable()
