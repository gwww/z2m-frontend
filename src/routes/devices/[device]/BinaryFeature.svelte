<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import type { DeviceState, ExposedBinary } from '$lib/types';
    import * as MQTT from '$lib/mqtt';
    import { isWritable } from '$lib/util';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    let state: Writable<DeviceState> = getContext('state');
    const id: string = getContext('id');
    let promise: Promise<string> | undefined = undefined;

    $: feature = $$props as ExposedBinary;
    $: value = $state && $state[feature.property] === feature.value_on;

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
    {$state ? $state[feature.property] : 'n/a'}
{/if}
