<script lang="ts">
    import { EXPOSED_FEATURE_TYPE } from '$lib/types';
    import type { Exposes } from '$lib/types';
    import * as Case from '$lib/utils/case';
    import StateSection from './StateSection.svelte';
    import WrappedFeature from './WrappedFeature.svelte';

    export let type = '';
    export let features: Exposes[] = [];

    const isComposite = (_type: string): boolean => {
        return (EXPOSED_FEATURE_TYPE as ReadonlyArray<string>).includes(_type);
    };

    const getCompositeTitle = (_type: string, name: string) => {
        if (_type === 'composite') return Case.any2Title(name);
        return `${Case.any2Title(_type)} Controls`;
    };
</script>

{#if isComposite(type)}
    <StateSection title={getCompositeTitle(type, $$restProps.name)}>
        {#each features as feature}
            <svelte:self {...feature} />
        {/each}
    </StateSection>
{:else if type === '_root_'}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        {#each features as feature}
            <svelte:self {...feature} />
        {/each}
    </div>
{:else if !$$restProps.access || $$restProps.access === 7}
    <WrappedFeature {...$$props} />
{/if}
