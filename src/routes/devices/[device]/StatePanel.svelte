<script lang="ts">
    import { devices, bridge_info } from '$lib/mqtt';
    import BuildState from './BuildState.svelte';
    import StateSection from './StateSection.svelte';
    import WrappedControl from './WrappedControl.svelte';
    import * as timeago from 'timeago.js';
    import { getContext } from 'svelte';
    import type { DeviceState, ExposedItemBase, Exposes } from '$lib/types';
    import { AccessType } from '$lib/types';
    import type { Writable } from 'svelte/store';
    import * as Case from '$lib/utils/case';

    export let id: string;

    $: device = $devices.find((d) => d.ieee_address === id);
    $: state = getContext('state') as Writable<DeviceState>;

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
    $: if ($state?.last_seen) {
        last_seen = timeago.format($state.last_seen as Date);
    }

    let exposed_list: ExposedItemBase[];
    $: exposed_list = (device?.device?.definition.exposes || []) as ExposedItemBase[];

    $: exposes = { type: '_root_', features: device?.device?.definition.exposes || [] };

    const get_readonly_property = (feature: Exposes) => {
        const access = (feature as ExposedItemBase).access;
        if (!access) return;
        if (access & AccessType.ACCESS_WRITE) return;
        if (!feature.property) return;
        if (!$state.hasOwnProperty(feature.property)) return;
        return $state[feature.property] || 'n/a';
    };
</script>

<StateSection title="Status">
    {#if availability_configured}
        {@const s = {
            type: '_html_',
            name: 'Availability',
            description: 'Is device online or offline',
            value: online_html,
        }}
        <WrappedControl {...s} />
    {/if}

    {#if last_seen_configured}
        {@const s = {
            type: '_html_',
            name: 'last_seen',
            description: 'How long ago a message was received from the device',
            value: last_seen,
        }}
        <WrappedControl {...s} />
    {/if}

    {#each exposed_list || [] as feature}
        {@const value = get_readonly_property(feature)}
        {#if value}
            <WrappedControl {...feature} />
        {/if}
    {/each}
</StateSection>

<BuildState {...exposes} />

<hr class="mt-4" />
