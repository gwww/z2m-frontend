<script lang="ts">
    import { SvgIcon } from '$components/SvgIcon';
    import { mdiCloseCircle, mdiCheckCircle } from '@mdi/js';
    import { writable } from 'svelte/store';
    import { page } from '$app/stores';
    import { devices, device_states } from '$lib/stores';
    import type { Device, DeviceState } from '$lib/types';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';

    let storeThree = writable('a');

    const key = $page.params.device;
    $: device = $devices.find((dev: Device) => dev.friendly_name === key);
    $: device_state = $device_states[key as keyof DeviceState];

    const image = 'https://www.zigbee2mqtt.io/images/devices/LED2003G10.jpg';
    let fallback = './static/zigbee-logo.png';
    const handleError = (e: Event) => ((<HTMLImageElement>e.target).src = fallback);
</script>

{#if device}
    <div class="card p-4 space-y-4">
        <div class="flex flex-wrap gap-8 justify-center items-center">
            <img
                class="h-24 sm:h-32 border-slate-400 rounded-xl border-4"
                src={image}
                alt=""
                on:error={handleError}
            />

            <div class="flex-auto">
                <label class="input-label">
                    <span class="text-sm text-surface-500 pl-2">Friendly name</span>
                    <div class="grid grid-cols-[1fr_auto_auto] !m-1">
                        <input class="text-2xl" type="text" value={key} placeholder="Name..." />
                        <div class="flex items-center">
                            <span class="text-error-500 ml-1">
                                <SvgIcon size={36} path={mdiCloseCircle} />
                            </span>
                            <span class="text-success-500 ml-0">
                                <SvgIcon size={36} path={mdiCheckCircle} />
                            </span>
                        </div>
                    </div>
                </label>

                <label class="input-label">
                    <span class="text-sm text-surface-500 pl-2">Description</span>
                    <div class="grid grid-cols-[1fr_auto_auto] !m-1">
                        <input type="text" placeholder="Description..." />
                        <div class="flex items-center">
                            <span class="text-error-500 ml-1">
                                <SvgIcon size={36} path={mdiCloseCircle} />
                            </span>
                            <span class="text-success-500 ml-0">
                                <SvgIcon size={36} path={mdiCheckCircle} />
                            </span>
                        </div>
                    </div>
                </label>
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
                    <SvgIcon path={mdiCloseCircle} />
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
