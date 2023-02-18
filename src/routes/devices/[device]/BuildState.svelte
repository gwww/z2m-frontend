<script lang="ts">
    import { EXPOSED_FEATURE_TYPE } from '$lib/types';
    import type { Dictionary, Exposes } from '$lib/types';
    import * as Case from '$lib/utils/case';
    import WrappedControl from './WrappedControl.svelte';

    // TODO: should types include undefined?
    export let type = '';
    export let features: Exposes[] = [];
    export let state: Dictionary<any>;

    $: console.log('In BuildState:', state);

    function isComposite(_type: string): boolean {
        return (EXPOSED_FEATURE_TYPE as ReadonlyArray<string>).includes(_type);
    }

    function getCompositeTitle(type: string, props: Record<string, string>) {
        if (type === 'composite') return Case.any2Title(props.name);
        return `${Case.any2Title(type)} Device`;
    }
</script>

{#if isComposite(type)}
    {@const title = getCompositeTitle(type, $$restProps)}
    <div class="card p-4 mt-4 variant-ringed-tertiary col-span-full">
        {#if title}
            <p class="p-1 !text-xl">{title}</p>
            <hr />
        {/if}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {#each features as feature}
                <svelte:self {...feature} />
            {/each}
        </div>
    </div>
{:else if type === '_root_'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {#each features as feature}
            <svelte:self {...feature} />
        {/each}
    </div>
{:else if !$$restProps.access || $$restProps.access === 7}
    <!-- {@const control = $$restProps} -->
    <!-- <div class={'p-4'}> -->
    <!--     <div class="font-bold text-primary-500 text-lg pb-1"> -->
    <!--         {Case.any2Title($$restProps.property)} -->
    <!--     </div> -->
    <!--     <div class="text-sm pb-2">{$$restProps.description}</div> -->
    <!--     {#if type === 'binary'} -->
    <!--         <BinaryControl {...$$props} /> -->
    <!--     {/if} -->
    <!-- </div> -->
    <WrappedControl {...$$props} {state} />
{/if}
