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
    },
    {
      name: 'Power',
      id: 'power_source',
      sort: true,
    },
  ];

  const tableSelector = '#myTable';

  $: data = $devices.filter((device) => device.type !== 'Coordinator');

  const columns2: Column[] = [
    {
      name: 'Month',
      id: 'month',
      sort: true,
    },
    {
      name: 'Saving',
      id: 'saving',
      render_html: (cell: any) => cell.a + '<br>' + cell.b,
      sort: true,
    },
    {
      name: 'Account',
      id: 'acct',
    },
  ];

  const data2 = [
    { month: 'January', saving: { a: 4, b: 2 }, acct: 'Checking' },
    {
      month: 'February',
      saving: { a: 'Forty', b: 'Two' },
      acct: 'Savings savings savings',
    },
  ];

  const columns3: Column[] = [
    {
      name: 'Month',
      sort: true,
    },
    {
      name: 'Saving',
      render_html: (cell: any) => cell.a + '<br>' + cell.b,
      sort: true,
    },
    {
      name: 'Account',
    },
  ];
  const data3 = [
    ['2January', { a: 4, b: 2 }, 'Checking'],
    ['2February', { a: 'Forty', b: 'Two' }, 'Savings savings savings'],
  ];

  const styles: Styles = {
    container: 'table-container mt-8',
    table: 'table table-hover',
  };
</script>

<DataTableFilter {tableSelector} />
<div id="myTable">
  <DataTable {columns} {data} {styles} />
</div>

<div id="myTable">
  <DataTable columns={columns2} data={data2} {styles} />
</div>

<div id="myTable2">
  <DataTable columns={columns3} data={data3} {styles} />
</div>

<!---->
<style>
</style>
