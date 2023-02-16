<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import type { ExposedItemBase, Exposes } from '$lib/types';

    let other: ExposedItemBase = $$props as ExposedItemBase;
    // let { ...other } = $$props;
    console.log('Other is In BinaryControl...', other);

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
