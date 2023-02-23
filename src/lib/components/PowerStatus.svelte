<script lang="ts">
    import type { PowerSource } from '$lib/types';
    import type { PopupSettings } from '@skeletonlabs/skeleton';
    import { popup } from '@skeletonlabs/skeleton';
    import generateId from '$lib/utils/generateId';

    const batteries = [
        ['i-mdi-battery-outline', 'red'],
        ['i-mdi-battery-10', 'red'],
        ['i-mdi-battery-20', 'red'],
        ['i-mdi-battery-30', 'yellow'],
        ['i-mdi-battery-40', 'yellow'],
        ['i-mdi-battery-50', 'green'],
        ['i-mdi-battery-60', 'green'],
        ['i-mdi-battery-70', 'green'],
        ['i-mdi-battery-80', 'green'],
        ['i-mdi-battery-90', 'green'],
        ['i-mdi-battery', 'green'],
    ];

    export let powerSource: PowerSource;
    export let powerLevel: number;

    const target = generateId();
    let powerTooltipSettings: PopupSettings = {
        event: 'hover',
        target: target,
        placement: 'top',
    };

    let icon: string;
    let colour = 'darkgray';
    $: tooltip_value = powerSource as string;
    $: if (powerSource === 'Battery') {
        if (powerLevel === undefined || powerLevel < 0 || powerLevel > 100) {
            icon = 'i-mdi-battery';
        } else {
            const p = Math.round(powerLevel / 10);
            icon = batteries[p][0];
            colour = batteries[p][1];
            tooltip_value += `: ${powerLevel}%`;
        }
    } else if (powerSource === 'Mains (single phase)') {
        icon = 'i-mdi-power-plug';
    } else if (powerSource === 'DC Source') {
        icon = 'i-mdi-current-dc';
    } else {
        tooltip_value = 'Powered';
        icon = 'i-mdi-power';
    }
</script>

{#key tooltip_value}
    <button use:popup={powerTooltipSettings} style="color: {colour}">
        <div class="{icon} text-2xl" />
    </button>
    <div
        class="text-xs text-center card variant-filled-primary p-2 whitespace-nowrap shadow-xl"
        data-popup={target}
    >
        {tooltip_value}
        <div class="arrow variant-filled-primary" />
    </div>
    <!-- <pre>{JSON.stringify(tooltip_value, null, 2)}</pre> -->
{/key}
