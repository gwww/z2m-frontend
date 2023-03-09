<script lang="ts">
    import type { DeviceState, ExposedEnum } from '$lib/types';
    import { RadioItem, RadioGroup } from '@skeletonlabs/skeleton';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import generateId from '$lib/utils/generateId';
    import * as MQTT from '$lib/mqtt';
    import * as Case from '$lib/utils/case';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    let state: Writable<DeviceState> = getContext('state');
    const gen_id = generateId();
    const feature = $$props as ExposedEnum;
    let promise: Promise<string> | undefined = undefined;
    const id: string = getContext('id');

    $: property = $state ? $state[feature.property] || '' : '';
    $: value = property;

    const enumChanged = () => {
        console.log('enum changed, value', value);
        promise = MQTT.set(id, { [feature.property]: `${value}` });
    };
</script>

{#if feature.values.length > 7}
    <select class="select text-sm max-w-[200px]" bind:value on:change={enumChanged}>
        {#each feature.values as item}
            <option value={item}>{Case.any2Title(item)}</option>
        {/each}
    </select>
{:else}
    <RadioGroup
        active="variant-filled-primary"
        hover="hover:variant-soft-primary"
        padding="text-sm px-2 py-1"
    >
        {#each feature.values as item}
            <RadioItem bind:group={value} name={gen_id} value={item} on:change={enumChanged}
                >{Case.any2Title(item)}</RadioItem
            >
        {/each}
    </RadioGroup>
{/if}
<RequestStatus {promise} />
