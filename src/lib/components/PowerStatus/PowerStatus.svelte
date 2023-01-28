<script lang="ts">
    import type { PowerSource } from '$lib/types';
    import { SvgIcon } from '$components/SvgIcon';
    import { tooltip } from '@skeletonlabs/skeleton';
    import {
        mdiBatteryOutline,
        mdiBattery10,
        mdiBattery20,
        mdiBattery30,
        mdiBattery40,
        mdiBattery50,
        mdiBattery60,
        mdiBattery70,
        mdiBattery80,
        mdiBattery90,
        mdiBattery,
        mdiPowerPlug,
        mdiCurrentDc,
        mdiPower,
    } from '@mdi/js';

    const batteries = [
        [mdiBatteryOutline, 'red'],
        [mdiBattery10, 'red'],
        [mdiBattery20, 'red'],
        [mdiBattery30, 'yellow'],
        [mdiBattery40, 'yellow'],
        [mdiBattery50, 'green'],
        [mdiBattery60, 'green'],
        [mdiBattery70, 'green'],
        [mdiBattery80, 'green'],
        [mdiBattery90, 'green'],
        [mdiBattery, 'green'],
    ];

    export let powerSource: PowerSource;
    export let powerLevel: number;

    let icon: string;
    let colour = 'darkgray';
    let tooltip_value = powerSource as string;
    if (powerSource === 'Battery') {
        if (powerLevel === undefined || powerLevel < 0 || powerLevel > 100) {
            icon = mdiBattery;
        } else {
            const p = Math.round(powerLevel / 10);
            icon = batteries[p][0];
            colour = batteries[p][1];
            tooltip_value += `: ${powerLevel}%`;
        }
    } else if (powerSource === 'Mains (single phase)') {
        icon = mdiPowerPlug;
    } else if (powerSource === 'DC Source') {
        icon = mdiCurrentDc;
    } else {
        icon = mdiPower;
    }
</script>

<button use:tooltip={{ content: tooltip_value, position: 'top' }} style="color: {colour}">
    <SvgIcon size={27} path={icon} />
</button>

<style>
</style>
