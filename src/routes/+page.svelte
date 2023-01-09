<script lang="ts">
	import { devices } from '$lib/stores';
	import { readable } from 'svelte/store';
	import { createTable, Subscribe, Render } from 'svelte-headless-table';
	import { addSortBy, addColumnOrder } from 'svelte-headless-table/plugins';

	const data = readable([
		{ name: 'Ada Lovelace', age: 21 },
		{ name: 'Barbara Liskov', age: 52 },
		{ name: 'Richard Hamming', age: 38 }
	]);

	const table = createTable(data, {
		sort: addSortBy({ disableMultiSort: true }),
		colOrder: addColumnOrder()
	});

	const columns = table.createColumns([
		table.column({
			header: 'Name',
			accessor: 'name'
		}),
		table.column({
			header: 'Age',
			accessor: 'age'
		})
	]);

	const { headerRows, rows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns, {
		rowDataId: (item, index) => item.name + ' HELLO ' + index
	});

	function rowClicked(row: any) {
		console.log((row as Record<string, unknown>).original);
		// console.log((row as Record<string, unknown>).dataId);
	}
</script>

<div class="table-container m-8">
	<table {...$tableAttrs} class="table table-hover">
		<thead>
			{#each $headerRows as headerRow (headerRow.id)}
				<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
					<tr {...rowAttrs}>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<th {...attrs} on:click={props.sort.toggle}>
									<Render of={cell.render()} />
									{#if props.sort.order === 'asc'}
										⬇️
									{:else if props.sort.order === 'desc'}
										⬆️
									{/if}
								</th>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</thead>
		<tbody {...$tableBodyAttrs}>
			{#each $rows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<tr {...rowAttrs} on:click={() => rowClicked(row)}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<td {...attrs}>
									<Render of={cell.render()} />
								</td>
							</Subscribe>
						{/each}
					</tr>
				</Subscribe>
			{/each}
		</tbody>
	</table>
</div>

{#each $devices as device}
	<h3>{device.friendly_name}</h3>
	<p>
		{device.ieee_address} / {device.network_address}
	</p>
	<p>{device.manufacturer}</p>
	<p>{device.model_id}</p>
{/each}
