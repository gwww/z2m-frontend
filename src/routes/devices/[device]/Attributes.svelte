<script lang="ts">
    import { DataTable, type Column, type Styles } from '$components/DataTable';
    import { device_available, device_states, devices, bridge_info } from '$lib/mqtt';

    export let id: string;

    $: device = $devices.find((dev) => dev.ieee_address === id);
    console.log('device', device);

    const dev = $devices.find((dev) => dev.ieee_address === id);
    console.log('dev', dev);

    // $: avail = $bridge_info?.config.availability !== undefined;
    // $: seen =
    //     $bridge_info?.config.advanced.last_seen &&
    //     $bridge_info.config.advanced.last_seen !== 'disable';
    //
    // $: states = $device_states;
    // $: dev_avail = $device_available;

    const data = [
        ['Friendly Name', device?.friendly_name],
        ['IEEE Address', device?.ieee_address],
        ['Network Address', device?.network_address],
        ['Manufacturer', device?.manufacturer],
        ['Model', device?.model_id],
        ['Zigbee Vendor', device?.definition.vendor],
        ['Zigbee Model', device?.definition.model],
        ['Firmware Build Date', device?.datecode],
        ['Firmware Version', device?.software_build_id],
        ['Device Type', device?.type],
        ['Device Description', device?.definition.description],
        ['Supported', device?.supported ? 'Yes' : 'No'],
        ['Interviewing', device?.interviewing ? 'Yes' : 'No'],
        ['Interview Complete', device?.interview_completed ? 'Yes' : 'No'],
    ];
    const columns: Column[] = [{ name: 'Attribute' }, { name: 'Value' }];
    const styles: Styles = {
        container: 'table-container mt-4',
        table: 'table table-hover md:table-fixed md:w-3/4 mx-auto',
    };
</script>

{#if device}
    <DataTable {columns} {data} {styles} />
{:else}
    <h1>Device {id} not found.</h1>
{/if}

<style>
</style>
