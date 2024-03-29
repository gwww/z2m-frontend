<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import * as timeago from 'timeago.js';
    import { devices, bridge_info } from '$lib/mqtt';
    import StateSection from './StateSection.svelte';
    import WrappedFeature from './WrappedFeature.svelte';
    import type { DeviceState, ExposedFeature, ExposedItemBase } from '$lib/types';
    import { AccessType, EXPOSED_FEATURE_TYPE } from '$lib/types';
    import { any2Title } from '$lib/util';

    export let id: string;

    let online_status = 'Not available';
    let last_seen = 'Not available';

    $: device = $devices.find((d) => d.ieee_address === id);
    $: state = getContext('state') as Writable<DeviceState>;

    $: availability_configured = $devices.some((d) => d.availability !== undefined);
    $: if (device?.availability !== undefined) {
        if (device.availability) {
            online_status = '<span class="text-success-600">Online</span>';
        } else {
            online_status = '<span class="text-error-500">Offline</span>';
        }
    }

    $: last_seen_configured =
        $bridge_info?.config.advanced.last_seen &&
        $bridge_info.config.advanced.last_seen !== 'disable';
    $: if ($state?.last_seen) {
        last_seen = timeago.format($state.last_seen as Date);
    }

    let exposed_status: ExposedItemBase[];
    let exposed_properties: ExposedItemBase[];
    let exposed_composite: ExposedFeature[];
    let exposed_feature: ExposedFeature;
    $: exposed = device?.device?.definition.exposes || [];
    $: {
        exposed_status = [];
        exposed_composite = [];
        exposed_properties = [];
        exposed.forEach((feature) => {
            if (feature.type === 'composite') {
                exposed_composite.push(feature as ExposedFeature);
            } else if (isFeature(feature.type)) {
                exposed_feature = feature as ExposedFeature;
            } else if (isReadOnly(feature as ExposedItemBase)) {
                exposed_status.push(feature as ExposedItemBase);
            } else {
                exposed_properties.push(feature as ExposedItemBase);
            }
        });
        exposed_composite = exposed_composite;
        exposed_properties = exposed_properties;
        exposed_status = exposed_status;
    }

    const isReadOnly = (feature: ExposedItemBase): boolean => {
        return (feature.access & AccessType.ACCESS_WRITE) === 0;
    };

    const isFeature = (_type: string): boolean => {
        return (EXPOSED_FEATURE_TYPE as ReadonlyArray<string>).includes(_type);
    };
</script>

<StateSection title="Status">
    {#if availability_configured}
        <WrappedFeature type="_html_" name="Availability" value={online_status} />
    {/if}

    {#if last_seen_configured}
        <WrappedFeature type="_html_" name="last_seen" value={last_seen} />
    {/if}

    {#each exposed_status as feature}
        <WrappedFeature {...feature} />
    {/each}
</StateSection>

{#if exposed_feature}
    <StateSection title={`${any2Title(exposed_feature.type)} Controls`}>
        {#each exposed_feature.features as feature}
            <WrappedFeature {...feature} />
        {/each}
    </StateSection>
{/if}

{#each exposed_composite as composite}
    <StateSection title={any2Title(composite.name || '')}>
        {#each composite.features as feature}
            <WrappedFeature {...feature} />
        {/each}
    </StateSection>
{/each}

{#if exposed_properties.length}
    <StateSection title="Properties">
        {#each exposed_properties as feature}
            <WrappedFeature {...feature} />
        {/each}
    </StateSection>
{/if}

<hr class="mt-4" />
