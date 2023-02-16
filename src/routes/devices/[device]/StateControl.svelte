<script lang="ts">
    import { device_available, device_states, devices, bridge_info } from '$lib/mqtt';
    import type { Device } from '$lib/types';
    import BuildState from './BuildState.svelte';
    import * as timeago from 'timeago.js';

    export let id: string;

    $: states = $device_states;
    $: device = $bridge_info?.config?.devices[id];

    $: availability_configured = $bridge_info?.config.availability !== undefined;
    $: online = $device_available[device.friendly_name];
    $: online_html = 'Not available';
    $: if (online !== undefined) {
        if (online) {
            online_html = '<span class="text-success-600">Online</span>';
        } else {
            online_html = '<span class="text-error-500">Offline</span>';
        }
    }

    $: last_seen_configured =
        $bridge_info?.config.advanced.last_seen &&
        $bridge_info.config.advanced.last_seen !== 'disable';
    $: last_seen = 'Not available';
    $: if (states[device?.friendly_name]?.last_seen) {
        last_seen = timeago.format(states[device.friendly_name].last_seen!);
    }

    $: device_model = $devices.find((dev: Device) => dev.ieee_address === id);
    $: state = $device_states[device.friendly_name];
    $: exposes = { type: '_root_', state: state, features: device_model!.definition.exposes };
    $: console.log('Exposes............', exposes);
</script>

<div class="flex justify-evenly mt-4 mb-8">
    {#if availability_configured}
        <div>
            Availability: {@html online_html}
        </div>
    {/if}
    {#if last_seen_configured}
        <div>
            Last seen: {@html last_seen}
        </div>
    {/if}
    {#if state}
        <div>
            Link Quality: {state.linkquality}
        </div>
    {/if}
</div>

<BuildState {...exposes} />

<hr class="mt-4" />

<style>
</style>
