<script lang="ts">
    import * as Case from '$lib/utils/case';
    import BinaryFeature from './BinaryFeature.svelte';
    import EnumFeature from './EnumFeature.svelte';
    import NumericFeature from './NumericFeature.svelte';
    import type { ComponentType } from 'svelte';
    import type { Dictionary } from '$lib/types';

    const feature_types: Dictionary<ComponentType> = {
        binary: BinaryFeature,
        enum: EnumFeature,
        numeric: NumericFeature,
    };

    $: feature = $$props;
</script>

<div class={'px-4 pt-4'}>
    <div class="text-primary-500 text-lg pb-1">
        {Case.any2Title(feature.name)}
    </div>
    {#if feature.description}
        <div class="text-xs pb-2">{feature.description}</div>
    {/if}

    {#if feature_types[feature.type]}
        <svelte:component this={feature_types[feature.type]} {...feature} />
    {:else if feature.type === '_html_'}
        {@html feature.value}
    {/if}
</div>
