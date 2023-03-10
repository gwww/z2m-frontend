<script lang="ts">
    import { AccessType, type DeviceState, type ExposedNumeric } from '$lib/types';
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import generateId from '$lib/utils/generateId';
    import { isWritable } from '$lib/utils/feature';
    import * as MQTT from '$lib/mqtt';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    let state: Writable<DeviceState> = getContext('state');
    const gen_id = generateId();
    const feature = $$props as ExposedNumeric;
    let promise: Promise<string> | undefined = undefined;
    const id: string = getContext('id');

    $: property = $state ? ($state[feature.property] as number) || 0 : 0;
    $: value = property;

    const numberChanged = () => {
        promise = MQTT.set(id, { [feature.property]: `${value}` });
    };
</script>

{#if isWritable(feature)}
    <div class="flex w-full">
        <div class="w-full pr-4">
            <RangeSlider
                name={gen_id}
                accent="!accent-primary-500"
                bind:value
                min={feature.value_min || 0}
                max={feature.value_max || 0}
                on:change={numberChanged}
            />
            <div class="flex justify-between items-center">
                <div class="text-xs">{feature.value_min || 0}</div>
                <div class="text-xs">{feature.unit || ''}</div>
                <div class="text-xs">{feature.value_max || 0}</div>
            </div>
        </div>
        <input class="input !text-sm max-w-[100px]" type="number" {value} />
    </div>
    <RequestStatus {promise} />
{:else}
    <p>{value || 'n/a'} {feature.unit || ''}</p>
{/if}
