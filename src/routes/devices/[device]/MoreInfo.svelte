<script lang="ts">
  import type { Device } from '$lib/types';

  export let parent: any;
  export let device: Device;
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2">
  <p>Zigbee Manufacturer</p>
  <strong>{device.manufacturer}</strong>

  <p>Zigbee Model</p>
  <strong>{device.model_id}</strong>

  <p>IEEE Address</p>
  <strong>{device.ieee_address}</strong>

  <p>Network Address</p>
  <strong>0x{device.network_address.toString(16)}</strong>
</div>

<footer class="modal-footer pt-4 {parent.regionFooter}">
  <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
    >{parent.buttonTextCancel}</button
  >
</footer>
