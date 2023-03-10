<script lang="ts">
    import { AccessType, type DeviceState, type ExposedBinary } from '$lib/types';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import * as MQTT from '$lib/mqtt';
    import { isWritable } from '$lib/utils/feature';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    let state: Writable<DeviceState>;
    let value: boolean;
    let feature: ExposedBinary;
    let promise: Promise<string> | undefined = undefined;
    const id: string = getContext('id');

    $: {
        feature = $$props as ExposedBinary;
        state = getContext('state');
        value = $state && $state[feature.property] === feature.value_on;
    }

    const changed = () => {
        promise = MQTT.set(id, {
            [feature.property]: value ? feature.value_off : feature.value_on,
        });
    };
</script>

{#if isWritable(feature)}
    <SlideToggle
        name="slider"
        size="sm"
        active="bg-primary-500"
        bind:checked={value}
        on:change={changed}
    />
    <RequestStatus {promise} />
{:else}
    {value}
{/if}
