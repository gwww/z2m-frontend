<script lang="ts">
	import Grid from 'gridjs-svelte';
	import { html } from 'gridjs';
	import 'gridjs/dist/theme/mermaid.css';
	import type { Device } from '$lib/types';
	import { devices } from '$lib/stores';

	function getDeviceAttrs(devices: Device[]): Record<string, unknown>[] {
		return devices.flatMap((device) => {
			if (device.type === 'Coordinator') {
				return [];
			}
			return [
				{
					name: device.friendly_name,
					makeModel: { make: device.definition.vendor, model: device.definition.model },
					make: device.definition.vendor,
					model: device.definition.model,
					addr: { ieee: device.ieee_address, network: device.network_address },
					power_source: device.power_source,
					picture: 'MCCGQ14LM'
				}
			];
		});
	}

	function strCmp(a: string, b: string): number {
		if (a < b) {
			return -1;
		} else if (a > b) {
			return 1;
		}
		return 0;
	}

	$: data = getDeviceAttrs($devices);

	const columns = [
		{ name: 'Name', id: 'name' },
		{
			name: 'Make / Model',
			id: 'makeModel',
			formatter: (cell: Record<string, undefined>) => html(`${cell.make}<br>${cell.model}`),
			sort: {
				compare: (a: Record<string, unknown>, b: Record<string, unknown>) => {
					return strCmp(a.make + a.model, b.make + b.model);
				}
			}
		},
		{
			name: 'Address',
			id: 'addr',
			formatter: (cell: Record<string, undefined>) => html(`${cell.ieee}<br>${cell.network}`),
			sort: {
				compare: (a: Record<string, unknown>, b: Record<string, unknown>) => {
					return strCmp(a.ieee + a.network, b.ieee + b.network);
				}
			}
		},
		{ name: 'Power', id: 'power_source' }
	];

	const className = {
		container: 'table-container m-8'
	};

	const search = {
		enabled: true
	};

	function log(...args) {
		console.log(...args);
	}
</script>

<Grid on:rowClick={log} {data} {columns} {className} {search} sort={true} />
