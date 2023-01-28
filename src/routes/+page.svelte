<script lang="ts">
    import { DataTable, DataTableFilter } from '$components/DataTable';
    import type { Column, Styles } from '$components/DataTable';
    import type { Device } from '$lib/types';
    import { device_available, device_states, devices, bridge_info } from '$lib/stores';
    import * as timeago from 'timeago.js';

    $: avail = $bridge_info?.config.availability !== undefined;
    $: seen =
        $bridge_info?.config.advanced.last_seen &&
        $bridge_info.config.advanced.last_seen !== 'disable';

    $: states = $device_states;
    $: dev_avail = $device_available;

    function renderStatus(device: Device): string {
        let html = '';
        if (avail) {
            const online = dev_avail[device.friendly_name];
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
            if (states[device.friendly_name]?.last_seen) {
                html += timeago.format(states[device.friendly_name]!.last_seen);
            } else {
                html += 'N/A';
            }
        }
        return html;
    }

    let columns: Column[];
    $: columns = [
        {
            name: 'Device',
            id: '',
            render_html: (cell: Device) => {
                return `<a href="/devices/${cell.friendly_name}">${cell.friendly_name}</a><br>${cell.definition.vendor} / ${cell.definition.model}`;
            },
            sort: true,
        },
        {
            name: 'Status',
            id: '',
            sort: true,
            hidden: !(seen || avail),
            render_html: (device: Device) => {
                // Placing this code in a function "hides" the reactivity
                let html = '';
                if (avail) {
                    const online = dev_avail[device.friendly_name];
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
                    if (states[device.friendly_name]?.last_seen) {
                        html += timeago.format(states[device.friendly_name].last_seen!);
                    } else {
                        html += 'N/A';
                    }
                }
                return html;
            },
        },
        {
            name: 'Address',
            id: '',
            render_html: (cell: Device) => `${cell.ieee_address}<br>${cell.network_address}`,
            sort: true,
        },
        {
            name: 'Power',
            id: 'power_source',
            sort: true,
        },
    ];

    $: data = $devices.filter((device) => device.type !== 'Coordinator');

    const tableSelector = '#myTable';
    const styles: Styles = {
        container: 'table-container mt-4',
        table: 'table table-hover',
    };
</script>

<DataTableFilter {tableSelector} />
<div id="myTable">
    <DataTable {columns} {data} {styles} />
</div>

<style>
</style>
