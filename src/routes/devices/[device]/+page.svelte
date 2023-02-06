<script lang="ts">
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    import * as MQTT from '$lib/mqtt';
    import { bridge_info, devices, device_states } from '$lib/mqtt';
    import type { Device, DeviceState } from '$lib/types';

    import DeviceImage from './DeviceImage.svelte';
    import InlineEdit from './InlineEdit.svelte';

    import { writable } from 'svelte/store';
    let storeThree = writable('c');

    const key = $page.params.device;
    $: device_model = $devices.find((dev: Device) => dev.ieee_address === key);
    $: device = $bridge_info?.config?.devices[key];
    $: device_state = $device_states[key as keyof DeviceState];

    function updateFriendlyname(response: CustomEvent<any>) {
        MQTT.rename(device.friendly_name, response.detail.value, response.detail.toggleChecked);
    }

    function updateDescription(response: CustomEvent<any>) {
        MQTT.set_description(key, response.detail.value);
    }
</script>

{#if device}
    <div class="card p-4 space-y-8">
        <div class="flex flex-wrap gap-4 justify-center items-center flex-col sm:flex-row">
            <DeviceImage image={device_model?.definition.model || ''} />

            <div>
                <InlineEdit
                    class="text-2xl"
                    type="text"
                    placeholder="Name..."
                    value={device.friendly_name}
                    toggle={'Update Home Assistant Entity'}
                    on:save={(i) => updateFriendlyname(i)}
                />
                <div class="mt-9" />
                <InlineEdit
                    class="text-sm"
                    type="text"
                    placeholder="Description..."
                    value={device.description}
                    on:save={(i) => updateDescription(i)}
                />
            </div>
        </div>

        <TabGroup
            selected={storeThree}
            justify="justify-start md:justify-center"
            borderColor="border-tertiary-500"
            fill="fill-tertiary-500"
            color="text-tertiary-500"
            hover="hover:bg-tertiary-500/10"
        >
            <Tab value="a">
                <svelte:fragment slot="lead">
                    <div class="i-mdi-close-circle" />
                </svelte:fragment>
                State
            </Tab>
            <Tab value="b">
                <svelte:fragment slot="lead">
                    <i class="fa-solid fa-clapperboard" />
                </svelte:fragment>
                Attributes
            </Tab>
            <Tab value="c">
                <svelte:fragment slot="lead">
                    <i class="fa-solid fa-tv" />
                </svelte:fragment>
                Settings
            </Tab>
            <Tab value="d">
                <svelte:fragment slot="lead">
                    <i class="fa-solid fa-tv" />
                </svelte:fragment>
                Advanced
            </Tab>
        </TabGroup>
        <div>
            {#if $storeThree === 'a'}
                <h3>Books</h3>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua.
                </p>
            {/if}
            {#if $storeThree === 'b'}
                <h3>Movies</h3>
                <p>
                    Nisl nunc mi ipsum faucibus vitae aliquet nec. Ac ut consequat semper viverra
                    nam libero justo laoreet. Nec sagittis aliquam malesuada.
                </p>
            {/if}
            {#if $storeThree === 'c'}
                <h3>Television</h3>
                <p>
                    Ut sem viverra aliquet eget sit. Porttitor lacus luctus accumsan tortor posuere
                    ac ut consequat. Vulputate enim nulla aliquet porttitor.
                </p>
            {/if}
            {#if $storeThree === 'd'}
                <h3>Stuff</h3>
            {/if}
        </div>
    </div>
{:else}
    <h3>Error: device {key} is unknown.</h3>
{/if}

<style>
</style>
