<script lang="ts">
    import * as Case from '$lib/utils/case';
    import BinaryControl from './BinaryControl.svelte';

    export let { ...feature } = $$props;
</script>

<div class={'p-4'}>
    <div class="font-bold text-primary-500 text-lg pb-1">
        {Case.any2Title(feature.property)}
    </div>
    <div class="text-sm pb-2">{feature.description}</div>

    {#if feature.type === 'binary'}
        <BinaryControl {feature} />
    {/if}
</div>
