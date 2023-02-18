<script lang="ts">
    import { DataTable, type Column, type Styles } from '$components/DataTable';
    import { devices } from '$lib/mqtt';

    export let id: string;

    $: device = $devices.find((d) => d.ieee_address === id)?.device;
    $: data = [
        ['Device Description', device?.definition.description],
        [
            'Vendor & Model',
            `<a href="https://www.zigbee2mqtt.io/supported-devices/#v=${device?.definition.vendor}" target=_blank>${device?.definition.vendor}</a>` +
                ` / <a href="https://www.zigbee2mqtt.io/devices/${device?.definition.model}.html" target=_blank>${device?.definition.model}</a>`,
        ],
        ['Manufacturer Info', `${device?.manufacturer} / ${device?.model_id}`],
        ['IEEE & Network Addresses', `${device?.ieee_address} / ${device?.network_address}`],
        ['Firmware Date & Version', `${device?.datecode} / ${device?.software_build_id}`],
        ['Device Type', device?.type],
        ['Supported', device?.supported ? 'Yes' : 'No'],
        ['Interviewing', device?.interviewing ? 'Yes' : 'No'],
        ['Interview Complete', device?.interview_completed ? 'Yes' : 'No'],
    ];
    const columns: Column[] = [
        { name: 'Attribute' },
        { name: 'Value', render_html: (value) => value },
    ];
    const styles: Styles = {
        container: 'table-container mt-4',
        table: 'table table-hover md:w-3/4 mx-auto',
    };
</script>

{#if device}
    <DataTable {columns} {data} {styles} />
{:else}
    <h1>Device {id} not found.</h1>
{/if}

<style>
</style>
