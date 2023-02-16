<script lang="ts">
    import * as Case from '$lib/utils/case';
    import type { ExposedItemBase } from '$lib/types';
    import BinaryControl from './BinaryControl.svelte';

    export let { state, ...control } = $$props;
    // let control: ExposedItemBase = $$props as ExposedItemBase;
    console.log('In WrappedControl', state, control);
</script>

<div class={'p-4'}>
    <div class="font-bold text-primary-500 text-lg pb-1">
        {Case.any2Title(control.property)}
    </div>
    <div class="text-sm pb-2">{control.description}</div>

    {#if control.type === 'binary'}
        <BinaryControl />
    {/if}
</div>
