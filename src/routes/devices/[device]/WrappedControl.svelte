<script lang="ts">
    import * as Case from '$lib/utils/case';
    import type { Dictionary, ExposedItemBase, Exposes } from '$lib/types';
    import BinaryControl from './BinaryControl.svelte';

    export let { ...feature } = $$props;
    $: console.log('WrappedControl...', feature);

    // export let feature: ExposedItemBase;
    // export let state: Dictionary<any>;
    // export let features: Exposes[] = [];
    // export let data;
    //
    // export let { state, feature } = data;
    // let control: ExposedItemBase = $$props as ExposedItemBase;
    // $: console.log('In WrappedControl state', state);
    // $: console.log('In WrappedControl feature', feature);
</script>

<div class={'p-4'}>
    <div class="font-bold text-primary-500 text-lg pb-1">
        {Case.any2Title(feature.property)}
    </div>
    <div class="text-sm pb-2">{feature.description}</div>

    {#if feature.type === 'binary'}
        <BinaryControl />
    {/if}
</div>
