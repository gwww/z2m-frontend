<script lang="ts">
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import { devices, device_states } from '$lib/stores';
    import type { Device, DeviceState } from '$lib/types';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { Modal, modalStore } from '@skeletonlabs/skeleton';
    import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
    import EditFriendlyName from './EditFriendlyName.svelte';

    let storeThree = writable('c');

    const key = $page.params.device;
    let name = key;
    $: device = $devices.find((dev: Device) => dev.friendly_name === key);
    $: device_state = $device_states[key as keyof DeviceState];

    let image: string;
    $: if (device) {
        image = `https://www.zigbee2mqtt.io/images/devices/${device.definition.model.replace(
            '/',
            '-'
        )}.jpg`;
    }
    let fallback = '/images/zigbee-logo.png';

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
                    name = r.name;
                }
            },
        };
        modalStore.trigger(d);
    }

    const handleError = (e: Event) => ((<HTMLImageElement>e.target).src = fallback);
</script>

{#if device}
    <div class="card p-4 space-y-4">
        <div class="flex flex-wrap gap-4 justify-center items-center flex-col sm:flex-row">
            <img
                class="h-24 sm:h-32 border-slate-400 rounded-xl border-4"
                src={image}
                alt=""
                on:error={handleError}
            />

            <div>
                <h1 class="group my-2 !text-4xl !font-medium text-center sm:text-left">
                    <!-- prettier-ignore -->
                    <button class="mr-2 text-tertiary-500 mb-1" on:click={modalComponentForm}>
                        <div class="i-mdi-square-edit-outline !h-[24px] !w-[24px] invisible group-hover:visible" />
                    </button>{name}
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
