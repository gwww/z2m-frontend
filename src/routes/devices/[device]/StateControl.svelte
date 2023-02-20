<script lang="ts">
    import { devices, bridge_info } from '$lib/mqtt';
    import BuildState from './BuildState.svelte';
    import * as timeago from 'timeago.js';
    import { setContext } from 'svelte';
    import { writable } from 'svelte/store';

    export let id: string;

    $: device = $devices.find((d) => d.ieee_address === id);

    // https://imfeld.dev/writing/svelte_context
    $: state = device?.state;
    $: setContext('state', state);

    $: availability_configured = $devices.some((d) => d.availability !== undefined);
    $: online_html = 'Not available';
    $: if (device?.availability !== undefined) {
        if (device?.availability) {
            online_html = '<span class="text-success-600">Online</span>';
        } else {
            online_html = '<span class="text-error-500">Offline</span>';
        }
    }

    $: last_seen_configured =
        $bridge_info?.config.advanced.last_seen &&
        $bridge_info.config.advanced.last_seen !== 'disable';
    $: last_seen = 'Not available';
    $: if (state?.last_seen) {
        last_seen = timeago.format(state.last_seen);
    }

    $: exposes = { type: '_root_', features: device?.device?.definition.exposes };
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
