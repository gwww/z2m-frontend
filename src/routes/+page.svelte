<script lang="ts">
    import { DataTable, DataTableFilter } from '$components/DataTable';
    import type { Column, Styles } from '$components/DataTable';
    import type { Device, DeviceDefinition } from '$lib/types';
    import { devices } from '$lib/stores';

    const columns: Column[] = [
        {
            name: 'Name',
            id: 'friendly_name',
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

    const tableSelector = '#myTable';
    const styles: Styles = {
        container: 'table-container mt-8',
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
