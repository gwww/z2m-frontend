<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import type { ExposedItemBase, GenericObject } from '$lib/types';
    import { getContext } from 'svelte';

    let feature: ExposedItemBase = $$props as ExposedItemBase;

    // See: https://imfeld.dev/writing/svelte_context getContext discussion
    let state = getContext('state') as SvelteStore<GenericObject>;
    console.log('BinaryControl', feature, $state);

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
