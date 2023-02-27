<script lang="ts">
    import { devices, bridge_info } from '$lib/mqtt';
    import BuildState from './BuildState.svelte';
    import StateSection from './StateSection.svelte';
    import WrappedFeature from './WrappedFeature.svelte';
    import * as timeago from 'timeago.js';
    import { getContext } from 'svelte';
    import type { DeviceState, ExposedItemBase, Exposes } from '$lib/types';
    import { AccessType, EXPOSED_FEATURE_TYPE } from '$lib/types';
    import type { Writable } from 'svelte/store';

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

    const isComposite = (_type: string): boolean => {
        return (EXPOSED_FEATURE_TYPE as ReadonlyArray<string>).includes(_type);
    };

    const is_writable_property = (feature: Exposes) => {
        if (isComposite(feature.type)) return false;
        const access = (feature as ExposedItemBase).access;
        if (!access) return true;
        if (access & AccessType.ACCESS_WRITE) return true;
        return false;
    };

    const get_readonly_property = (feature: Exposes) => {
        const access = (feature as ExposedItemBase).access;
        if (!access) return;
        if (access & AccessType.ACCESS_WRITE) return;
        if (!feature.property) return;
        if (!$state) return;
        if (!$state.hasOwnProperty(feature.property)) return;
        return $state[feature.property] || 'n/a';
    };
</script>

<StateSection title="Status">
    {#if availability_configured}
        <WrappedFeature
            type="_html_"
            description="Device online/offline status"
            name="Availability"
            value={online_html}
        />
    {/if}

    {#if last_seen_configured}
        <WrappedFeature
            type="_html_"
            name="last_seen"
            description="How long ago a message was received from the device"
            value={last_seen}
        />
    {/if}

    {#each exposed_list || [] as feature}
        {@const value = get_readonly_property(feature)}
        {#if value}
            <WrappedFeature {...feature} />
        {/if}
    {/each}
</StateSection>

<BuildState {...exposes} />

<StateSection title="Properties">
    {#each exposed_list || [] as feature}
        {#if is_writable_property(feature)}
            <WrappedFeature {...feature} />
        {/if}
    {/each}
</StateSection>

<hr class="mt-4" />
