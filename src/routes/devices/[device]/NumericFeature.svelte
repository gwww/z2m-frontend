<script lang="ts">
    import type { DeviceState, ExposedBinary } from '$lib/types';
    import { getContext } from 'svelte';
    import type { Writable } from 'svelte/store';

    let state: Writable<DeviceState>;
    let feature: ExposedBinary;
    let value: number;

    $: {
        feature = $$props as ExposedBinary;
        state = getContext('state');
        if ($state && typeof $state[feature.property] == 'number') {
            value = $state[feature.property] as number;
        }
    }
</script>

<p>{value || 'n/a'} {feature.unit || ''}</p>
