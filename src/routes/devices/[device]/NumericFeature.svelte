<script lang="ts">
    import { AccessType, type DeviceState, type ExposedNumeric } from '$lib/types';
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';
    import generateId from '$lib/utils/generateId';

    let state: Writable<DeviceState> = getContext('state');
    const id = generateId();
    const feature = $$props as ExposedNumeric;

    $: property = $state ? ($state[feature.property] as number) || 0 : 0;
    $: value = property;
</script>

{#if feature.access & AccessType.ACCESS_WRITE}
    <RangeSlider
        name={id}
        accent="!accent-primary-500"
        bind:value
        min={feature.value_min || 0}
        max={feature.value_max || 0}
    />
    <div class="flex justify-between items-center">
        <div class="text-xs">{value} / {feature.value_max || 0}</div>
    </div>
{:else}
    <p>{value || 'n/a'} {feature.unit || ''}</p>
{/if}
