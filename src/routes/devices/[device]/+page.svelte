<script lang="ts">
  import { page } from '$app/stores';
  import { devices, device_states } from '$lib/stores';
  import type { Device, DeviceState } from '$lib/types';
  import MoreInfo from './MoreInfo.svelte';
  import { FloatingLabelInput } from '$components/FloatingLabelInput';
  import { modalStore } from '@skeletonlabs/skeleton';
  import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';

  const key = $page.params.device;
  $: device = $devices.find((dev: Device) => dev.friendly_name === key);
  $: device_state = $device_states[key as keyof DeviceState];

  const image = 'https://www.zigbee2mqtt.io/images/devices/LED2003G10.jpg';
  let fallback = './static/zigbee-logo.png';
  const handleError = (e: Event) => ((<HTMLImageElement>e.target).src = fallback);

  function moreInfo(): void {
    const c: ModalComponent = {
      ref: MoreInfo,
      props: { device: device },
    };
    const d: ModalSettings = {
      type: 'component',
      title: `${key} device details`,
      component: c,
      buttonTextCancel: 'Close',
      modalClasses: 'max-w-screen-lg',
    };
    modalStore.trigger(d);
  }
</script>

{#if device}
  <div class="flex flex-wrap gap-8 justify-center">
    <img
      class="h-24 sm:h-32 border-slate-400 rounded-xl border-4"
      src={image}
      alt=""
      on:error={handleError}
    />

    <div class="flex-auto space-y-6 pt-2">
      <FloatingLabelInput
        value={key}
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

  <button class="btn btn-filled-primary btn-sm mt-4" on:click={moreInfo}>Device details</button>
{:else}
  <h3>Error: device {key} is unknown.</h3>
{/if}

<!-- <pre class="mt-4"> -->
<!--   {JSON.stringify(device_state, null, 2)} -->

<!-- </pre> -->
<style>
</style>
