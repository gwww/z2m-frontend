<script lang="ts">
    import { DataTable, DataTableFilter } from '$components/DataTable';
    import type { Column, Styles } from '$components/DataTable';
    import type { ConsolidatedDevice } from '$lib/types';
    import { devices } from '$lib/mqtt';
    import * as timeago from 'timeago.js';
    import PowerStatus from '$components/PowerStatus.svelte';

    $: avail = $devices.some((d) => d.availability !== undefined);
    $: seen = $devices.some((d) => d.state?.last_seen);

    let columns: Column[];
    $: columns = [
        {
            name: 'Device',
            id: '',
            render_html: (device: ConsolidatedDevice) => {
                return `<a href="/devices/${device.ieee_address}">${device.config_info?.friendly_name}</a><br>\
                    ${device.device?.definition.vendor} / ${device.device?.definition.model}`;
            },
            sort: true,
        },
        {
            name: 'Status',
            id: '',
            sort: true,
            hidden: !(seen || avail),
            render_html: (device: ConsolidatedDevice) => {
                // Placing this code in a function "hides" the reactivity
                let html = '';
                if (avail) {
                    const online = device.availability;
                    if (online !== undefined) {
                        if (online) {
                            html = '<span class="text-success-600">Online</span><br>';
                        } else {
                            html = '<span class="text-error-500">Offline</span><br>';
                        }
                    } else {
                        html = 'N/A<br>';
                    }
                }
                if (seen) {
                    if (device?.state?.last_seen) {
                        html += timeago.format(device.state.last_seen as Date);
                    } else {
                        html += 'N/A';
                    }
                }
                return html;
            },
        },
        {
            name: 'Power',
            id: '',
            component: (device: ConsolidatedDevice) => {
                return {
                    comp: PowerStatus,
                    props: {
                        powerSource: device.device?.power_source,
                        powerLevel: device.state?.battery,
                    },
                };
            },
            sort: true,
        },
        {
            name: 'Address',
            id: '',
            render_html: (device: ConsolidatedDevice) =>
                `${device.ieee_address}<br>${device.device?.network_address}`,
            sort: true,
        },
    ];

    $: data = $devices.filter((device) => device.device?.type !== 'Coordinator');

    const tableId = 'dashboardTable';
    const styles: Styles = {
        container: 'table-container mt-4',
        table: 'table table-hover',
    };
</script>

{#if $devices}
    <DataTableFilter {tableId} />
    <DataTable {columns} {data} {styles} {tableId} />
{/if}
