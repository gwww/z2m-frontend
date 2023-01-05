<script lang="ts">
	// import { devices } from '$lib/stores';

	// let devicesValue: string;
	//
	// devices.subscribe((value) => {
	// 	console.log('Devices changed! "', value, '"');
	// 	devicesValue = value;
	// });
	export let data;
	const { devices } = data;
	// console.log(data);
</script>

<p>Devices: {devices}</p>
