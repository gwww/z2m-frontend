<script lang="ts">
	import type { Column } from './types';
	export let columns: Column[];
	export let data: Array<any[]>;
</script>

<div class="table-container mt-8">
	<table class="table table-hover">
		<thead>
			<tr>
				{#each columns as item}
					<th>{item.name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row}
				<tr>
					{#each row as item, i}
						{#if columns[i].render !== undefined}
							<td>{columns[i].render(item)}</td>
						{:else if columns[i].id !== undefined}
							<td>{item[columns[i].id]}</td>
						{:else}
							<td>{item}</td>
						{/if}
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
</style>
