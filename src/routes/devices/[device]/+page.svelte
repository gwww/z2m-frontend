<script lang="ts">
    import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { modalStore } from '@skeletonlabs/skeleton';

    import { page } from '$app/stores';

    import { devices, device_states } from '$lib/mqtt';
    import * as MQTT from '$lib/mqtt';
    import type { Device, DeviceState } from '$lib/types';

    import EditFriendlyName from './EditFriendlyName.svelte';
    import DeviceImage from './DeviceImage.svelte';

    import { writable } from 'svelte/store';
    let storeThree = writable('c');

    const key = $page.params.device;
    $: device = $devices.find((dev: Device) => dev.ieee_address === key);
    $: device_state = $device_states[key as keyof DeviceState];

    let name: string;
    $: if (device) {
        name = device.friendly_name;
    }

    function modalComponentForm(): void {
        const c: ModalComponent = {
            ref: EditFriendlyName,
            props: { name: name },
        };
        const d: ModalSettings = {
            type: 'component',
            title: 'Edit device name',
            // body: 'Complete the form below and then press submit.',
            component: c,
            response: (r: any) => {
                if (r) {
                    MQTT.rename(name, r.name, false);
                    name = r.name;
                }
            },
        };
        modalStore.trigger(d);
    }
</script>

{#if device}
    <div class="card p-4 space-y-4">
        <div class="flex flex-wrap gap-4 justify-center items-center flex-col sm:flex-row">
            <DeviceImage image={device.definition.model} />

            <div>
                <h1 class="group my-2 !text-4xl !font-medium text-center sm:text-left">
                    <!-- prettier-ignore -->
                    <button class="mr-2 text-tertiary-500 mb-1" on:click={modalComponentForm}>
                        <div class="i-mdi-square-edit-outline !h-[24px] !w-[24px] invisible group-hover:visible" />
                    </button>{device.friendly_name}
                </h1>
                <p class="group my-2 text-center sm:text-left">
                    <!-- prettier-ignore -->
                    <button class="mr-2 text-tertiary-500 mb-1">
                        <div class="i-mdi-square-edit-outline !h-[24px] !w-[24px] invisible group-hover:visible" />
                    </button>Some description text that can be fairly long.
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
