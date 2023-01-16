<script lang="ts">
  import { DataTable, DataTableFilter } from '$components/DataTable';
  import type { Column, Styles } from '$components/DataTable';

  const columns: Column[] = [
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

  const data = [
    { month: 'January', saving: { a: 4, b: 2 }, acct: 'Checking' },
    {
      month: 'February',
      saving: { a: 'Forty', b: 'Two' },
      acct: 'Savings savings savings',
    },
  ];

  const columns2: Column[] = [
    {
      name: 'Month',
      sort: true,
      id: '',
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
  const data2 = [
    ['2January', { a: 4, b: 2 }, 'Checking'],
    ['2February', { a: 'Forty', b: 'Two' }, 'Savings savings savings'],
  ];

  const styles: Styles = {
    container: 'table-container mt-8',
    table: 'table table-hover',
  };

  const tableSelector = '#myTable';
</script>

<DataTableFilter {tableSelector} />
<div id="myTable">
  <DataTable {columns} {data} {styles} />
</div>

<div id="myTable2">
  <DataTable columns={columns2} data={data2} {styles} />
</div>

<style>
</style>
