<script lang="ts">
  import { page } from '$app/stores';
  import { device_states } from '$lib/stores';
  import type { DeviceState } from '$lib/types';
  import { FloatingLabelInput } from '$components/FloatingLabelInput';

  const key = $page.params.device;
  $: device_state = $device_states[key as keyof DeviceState];

  const image = 'https://www.zigbee2mqtt.io/images/devices/LED2003G10.jpg';
  let fallback = './static/zigbee-logo.png';
  const handleError = (e: Event) => ((<HTMLImageElement>e.target).src = fallback);
</script>

<div class="flex flex-wrap gap-8 justify-center">
  <img
    class="h-24 sm:h-32 border-slate-400 rounded-xl border-4"
    src={image}
    alt=""
    on:error={handleError}
  />

  <div class="flex-auto space-y-6">
    <FloatingLabelInput
      value={$page.params.device}
      name="friendly_name"
      label="Friendly name"
      text_size="text-2xl"
    />
    <FloatingLabelInput
      value="Test description text that has some length."
      name="description"
      label="Description"
    />
  </div>
</div>

<!-- <pre class="mt-4"> -->
<!--   {JSON.stringify(device_state, null, 2)} -->

<!-- </pre> -->
<style>
</style>
