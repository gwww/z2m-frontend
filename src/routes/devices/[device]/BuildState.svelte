<script lang="ts">
    import { EXPOSED_FEATURE_TYPE } from '$lib/types';
    import type { Exposes } from '$lib/types';
    import * as Case from '$lib/utils/case';
    import WrappedControl from './WrappedControl.svelte';

    export let type = '';
    export let features: Exposes[] = [];

    const isComposite = (_type: string): boolean => {
        return (EXPOSED_FEATURE_TYPE as ReadonlyArray<string>).includes(_type);
    };

    const getCompositeTitle = (_type: string, name: string) => {
        if (_type === 'composite') return Case.any2Title(name);
        return `${Case.any2Title(_type)} Device`;
    };
</script>

{#if isComposite(type)}
    {@const title = getCompositeTitle(type, $$restProps.name)}
    <!-- <div class="card p-4 mt-4 variant-ringed-tertiary col-span-full"> -->
    <div class="p-4 mt-4 col-span-full">
        {#if title}
            <p class="p-1 !text-xl">{title}</p>
            <hr />
        {/if}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
            {#each features as feature}
                <svelte:self {...feature} />
            {/each}
        </div>
        <!-- <hr /> -->
    </div>
{:else if type === '_root_'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {#each features as feature}
            <svelte:self {...feature} />
        {/each}
    </div>
{:else if !$$restProps.access || $$restProps.access === 7}
    <WrappedControl {...$$props} />
{/if}
