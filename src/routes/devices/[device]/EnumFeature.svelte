<script lang="ts">
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import { RadioItem, RadioGroup } from '@skeletonlabs/skeleton';
    import type { DeviceState, ExposedEnum } from '$lib/types';
    import { any2Title, generateId, isWritable } from '$lib/util';
    import * as MQTT from '$lib/mqtt';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    const gen_id = generateId();
    const feature = $$props as ExposedEnum;
    let promise: Promise<string> | undefined = undefined;
    let state: Writable<DeviceState> = getContext('state');
    const id: string = getContext('id');

    $: property = $state ? $state[feature.property] || '' : '';
    $: value = property;

    const enumChanged = () => {
        promise = MQTT.set(id, { [feature.property]: `${value}` });
    };
</script>

{#if !isWritable(feature)}
    <p>{value || 'n/a'} {feature.unit || ''}</p>
{:else if feature.values.length <= 7}
    <RadioGroup
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
        padding="text-sm px-2 py-1"
    >
        {#each feature.values as item}
            <RadioItem bind:group={value} name={gen_id} value={item} on:change={enumChanged}
                >{any2Title(item)}</RadioItem
            >
        {/each}
    </RadioGroup>
{:else}
    <select class="select text-sm max-w-[200px]" bind:value on:change={enumChanged}>
        {#each feature.values as item}
            <option value={item}>{any2Title(item)}</option>
        {/each}
    </select>
{/if}
<RequestStatus {promise} />
