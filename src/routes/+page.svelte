<script lang="ts">
    import { DataTable, DataTableFilter } from '$components/DataTable';
    import type { Column, Styles } from '$components/DataTable';
    import type { Device, DeviceDefinition } from '$lib/types';
    import { device_available, device_states, devices, bridge_info } from '$lib/stores';

    const columns: Column[] = [
        {
            name: 'Name',
            id: 'friendly_name',
            render_html: (cell: Device) => `<a href="/devices/${cell}">${cell}</a>`,
            sort: true,
        },
        {
            name: 'Make / Model',
            id: 'definition',
            render_html: (cell: DeviceDefinition) => `${cell.vendor}<br>${cell.model}`,
            sort: true,
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

    const avail = $bridge_info?.config.availability !== undefined;
    const seen =
        $bridge_info?.config.advanced.last_seen &&
        $bridge_info.config.advanced.last_seen !== 'disable';
    if (seen || avail) {
        const column = {
            name: 'Status',
            id: '',
            render_html: (cell: Device) => {
                let html = '';
                if (avail) {
                    const online = $device_available[cell.friendly_name];
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
                    if ($device_states[cell.friendly_name]?.last_seen) {
                        html += $device_states[cell.friendly_name]!.last_seen;
                    } else {
                        html += 'N/A';
                    }
                }
                return html;
            },
        };
        columns.splice(2, 0, column);
    }

    const tableSelector = '#myTable';
    const styles: Styles = {
        container: 'table-container mt-4',
        table: 'table table-hover',
    };

    $: data = $devices.filter((device) => device.type !== 'Coordinator');
</script>

<DataTableFilter {tableSelector} />
<div id="myTable">
    <DataTable {columns} {data} {styles} />
</div>

<style>
</style>
