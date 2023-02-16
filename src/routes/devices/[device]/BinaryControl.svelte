<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import type { ExposedItemBase } from '$lib/types';

    let control: ExposedItemBase = $$props as ExposedItemBase;
    console.log('Other is In BinaryControl...', control);

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
