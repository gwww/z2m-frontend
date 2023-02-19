<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import type { ExposedItemBase } from '$lib/types';
    import { getContext } from 'svelte';

    let feature: ExposedItemBase = $$props as ExposedItemBase;

    const state = getContext('state');
    console.log('BinaryControl', feature, state);

    let value: boolean;
    const changed = () => {
        console.log(value);
    };
</script>

<SlideToggle
    name="slider"
    size="sm"
    active="bg-primary-500"
    bind:checked={value}
    on:change={changed}
/>
