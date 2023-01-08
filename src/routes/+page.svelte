<script lang="ts">
	import { devices } from '$lib/stores';
</script>

{#each $devices as device}
	<h3>{device.friendly_name}</h3>
	<p>
		{device.ieee_address} / {device.network_address}
	</p>
	<p>{device.manufacturer}</p>
	<p>{device.model_id}</p>
{/each}
