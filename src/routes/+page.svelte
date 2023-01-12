<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import 'gridjs/dist/theme/mermaid.css';
	import type { Device } from '$lib/types';
	import { devices } from '$lib/stores';

	function strCmp(a: string, b: string): number {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		}
		return 0;
	}

	function log(...args: any[]) {
		console.log(...args);
	}

	const columns = [
		{
			name: 'Name',
			id: 'friendly_name',
		},
		{
			name: 'Make / Model',
			data: (row: Device) => {
				return [row.definition.vendor, row.definition.model];
			},
			formatter: (cell: Array<string>) => html(`${cell[0]}<br>${cell[1]}`),
			sort: {
				compare: (a: Array<string>, b: Array<string>) => {
					return strCmp(a[0] + a[1], b[0] + b[1]);
				},
			},
		},
		{
			name: 'Address',
			data: (row: Device) => {
				return [row.ieee_address, '0x' + row.network_address.toString(16)];
			},
			formatter: (cell: Record<string, undefined>) => html(`${cell[0]}<br>${cell[1]}`),
			sort: {
				compare: (a: Array<string>, b: Array<string>) => {
					return strCmp(a[0] + a[1], b[0] + b[1]);
				},
			},
		},
		{
			name: 'Power',
			id: 'power_source',
		},
	];

	const className = {
		container: 'table-container m-8',
		table: 'table-auto',
	};

	const search = { enabled: true };

	$: data = $devices.filter((device) => device.type !== 'Coordinator');
</script>

<Grid on:rowClick={log} {data} {columns} {className} {search} sort={true} />
