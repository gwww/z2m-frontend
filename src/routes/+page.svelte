<script lang="ts">
  import { DataTable } from '$components/DataTable';
  import type { Column } from '$components/DataTable';

  const columns: Column[] = [
    {
      name: 'Month',
      id: 'month',
    },
    {
      name: 'Saving',
      id: 'saving',
      render: (cell: any) => '<b>Cell42: </b><br>' + cell.a + cell.b,
    },
    {
      name: 'Account',
      id: 'acct',
    },
  ];

  const data = [
    { month: 'January', saving: { a: 4, b: 2 }, acct: 'Checking' },
    { month: 'February', saving: { a: 'Forty', b: 'Two' }, acct: 'Savings' },
  ];
</script>

<DataTable {columns} {data} />
