<script lang="ts">
	import { DataTable } from '$components/DataTable';
	import type { Column } from '$components/DataTable';

	const columns: Column[] = [
		{
			name: 'Month',
			id: 'foo',
		},
		{
			name: 'Saving',
			id: 'foo',
			render: (cell: any) => 'Cell42: ' + cell.a + cell.b,
		},
		{
			name: 'Account',
			id: 'acct',
		},
	];

	const data = [
		['foo', { a: '4', b: '2' }, { acct: 'Checking' }],
		['moo', { a: 'Forty', b: 'two' }, { acct: 'Savings' }],
		// ['moo', 'zoo'],
	];
</script>

<DataTable {columns} {data} />
