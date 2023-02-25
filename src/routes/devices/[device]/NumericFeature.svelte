<script lang="ts">
    import type { DeviceState, ExposedBinary } from '$lib/types';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

    let state: Writable<DeviceState>;
    let feature: ExposedBinary;

    $: {
        feature = $$props as ExposedBinary;
        state = getContext('state');
    }
</script>

<p>{$state[feature.property] || 'n/a'} {feature.unit || ''}</p>
