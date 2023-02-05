<script lang="ts">
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    import { bridge_info, devices, device_states } from '$lib/mqtt';
    import type { Device, DeviceState, Dictionary } from '$lib/types';
    // import * as MQTT from '$lib/mqtt';

    import EditFriendlyName from './EditFriendlyName.svelte';
    import EditDescription from './EditDescription.svelte';
    import DeviceImage from './DeviceImage.svelte';

    import { writable } from 'svelte/store';
    import EditFieldModal from './EditFieldModal.svelte';
    let storeThree = writable('c');

    const key = $page.params.device;
    $: device_model = $devices.find((dev: Device) => dev.ieee_address === key);
    $: device = $bridge_info?.config?.devices[key];
    // $: device_state = $device_states[key as keyof DeviceState];

    function updateFriendlyname(response: Dictionary<string>) {
        console.log('updateFriendlyname', response);
    }

    function updateDescription(response: Dictionary<string>) {
        console.log('updateDescription', response);
    }
</script>

{#if device}
    <div class="card p-4 space-y-4">
        <div class="flex flex-wrap gap-4 justify-center items-center flex-col sm:flex-row">
            <DeviceImage image={device_model?.definition.model || ''} />

            <div>
                <h1 class="group my-2 !text-4xl !font-medium text-center sm:text-left">
                    <EditFieldModal
                        modalDialog={EditFriendlyName}
                        title="Edit device name"
                        props={{ name: device.friendly_name }}
                        onsave={updateFriendlyname}
                    />{device.friendly_name}
                </h1>
                <p class="group my-2 text-center sm:text-left">
                    <EditFieldModal
                        modalDialog={EditDescription}
                        title="Edit description"
                        props={{ description: device.description || '' }}
                        onsave={updateDescription}
                    />{device.description || 'Default description text...'}
                </p>
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
