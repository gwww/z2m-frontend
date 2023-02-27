<script lang="ts">
    import * as Case from '$lib/utils/case';
    import BinaryFeature from './BinaryFeature.svelte';
    import NumericFeature from './NumericFeature.svelte';
    // import type { PopupSettings } from '@skeletonlabs/skeleton';
    // import { popup } from '@skeletonlabs/skeleton';
    // import generateId from '$lib/utils/generateId';

    // export let { ...feature } = $$props;
    $: feature = $$props;

    // const target = generateId();
    // let infoPopupSettings: PopupSettings = {
    //     event: 'click',
    //     target: target,
    //     placement: 'top',
    // };
</script>

<div class={'px-4 pt-4'}>
    <div class="font-bold text-primary-500 text-lg pb-1">
        {Case.any2Title(feature.name)}
        <!-- <button -->
        <!--     use:popup={infoPopupSettings} -->
        <!--     class="bg-surface-400 mb-2 rounded-full i-mdi-information" -->
        <!--     type="button" -->
        <!-- /> -->
        <!-- <div class="card variant-filled-secondary p-4 w-96 shadow-xl" data-popup={target}> -->
        <!--     <div class="space-y-4"> -->
        <!--         <p class="!text-sm font-normal">{feature.description}</p> -->
        <!--         <button class="btn-sm float-right variant-filled">Close</button> -->
        <!--     </div> -->
        <!--     <div class="arrow variant-filled-secondary" /> -->
        <!-- </div> -->
    </div>
    <div class="text-xs pb-2">{feature.description}</div>

    {#if feature.type === 'binary'}
        <BinaryFeature {...feature} />
    {:else if feature.type === 'numeric'}
        <NumericFeature {...feature} />
    {:else if feature.type === '_html_'}
        {@html feature.value}
    {/if}
    <!-- <pre>{JSON.stringify(feature)}</pre> -->
</div>
