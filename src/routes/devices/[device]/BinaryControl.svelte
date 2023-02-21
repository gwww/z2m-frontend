<script lang="ts">
    import type { DeviceState, ExposedBinary } from '$lib/types';
    import { getContext } from 'svelte';
    import * as MQTT from '$lib/mqtt';
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    let state: SvelteStore<DeviceState>;
    let value: boolean;
    let feature: ExposedBinary;
    let promise: Promise<string> | undefined = undefined;
    const id: string = getContext('id');

    $: {
        feature = $$props as ExposedBinary;
        state = getContext('state');
        value = $state?.state === feature.value_on;
    }

    const changed = () => {
        promise = MQTT.set(id, {
            // [feature.property]: value ? feature.value_off : feature.value_on,
            [feature.property]: feature.value_off,
        });
    };
</script>

<SlideToggle
    name="slider"
    size="sm"
    active="bg-primary-500"
    bind:checked={value}
    on:change={changed}
/>

<RequestStatus {promise} show={promise !== undefined} />
