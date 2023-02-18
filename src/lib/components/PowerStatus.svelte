<script lang="ts">
    import type { PowerSource } from '$lib/types';
    import { tooltip } from '@skeletonlabs/skeleton';

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
    <button use:tooltip={{ content: tooltip_value, position: 'top' }} style="color: {colour}">
        <div class="{icon} text-2xl" />
    </button>
{/key}
