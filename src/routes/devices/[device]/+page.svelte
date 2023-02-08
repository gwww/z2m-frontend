<script lang="ts">
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    import * as MQTT from '$lib/mqtt';
    import { bridge_info, devices, device_states } from '$lib/mqtt';
    import type { Device, DeviceState } from '$lib/types';

    import DeviceImage from './DeviceImage.svelte';
    import InlineEdit from '$components/InlineEdit.svelte';
    import type { SaveResult } from '$components/InlineEdit.svelte';
    import Attributes from './Attributes.svelte';

    let tabCurrent: number = 0;
    const desc =
        'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.';

    const key = $page.params.device;
    $: device_model = $devices.find((dev: Device) => dev.ieee_address === key);
    $: device = $bridge_info?.config?.devices[key];
    $: device_state = $device_states[key as keyof DeviceState];

    function updateFriendlyname(result: SaveResult): Promise<string> {
        console.log('updateFriendlyname called');
        return MQTT.rename(device.friendly_name, result.value, result.toggleChecked);
    }

    function updateDescription(result: SaveResult): Promise<string> {
        console.log('updateDescription called');
        return MQTT.set_description(key, result.value);
    }
</script>

{#if device}
    <div class="card p-4 space-y-8">
        <div class="flex flex-wrap gap-4 justify-center items-center flex-col sm:flex-row">
            <DeviceImage image={device_model?.definition.model || ''} />

            <div class="w-full md:w-3/5 lg:w-2/5">
                <InlineEdit
                    class="input text-2xl"
                    type="text"
                    placeholder="Name..."
                    value={device.friendly_name}
                    toggle={'Update Home Assistant Entity'}
                    callback={updateFriendlyname}
                />
                <div class="mt-9" />
                <InlineEdit
                    class="input text-sm"
                    type="text"
                    placeholder="Description..."
                    value={device.description}
                    callback={updateDescription}
                />
            </div>
        </div>

        <TabGroup
            justify="justify-center"
            active="border-b-4 border-primary-500"
            hover="hover:variant-soft-primary"
        >
            <!-- Tabs -->
            <Tab bind:group={tabCurrent} name="state" value={0}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-book" /></svelte:fragment>
                State/Control
            </Tab>
            <Tab bind:group={tabCurrent} name="attributes" value={1}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-film" /></svelte:fragment>
                Attributes
            </Tab>
            <Tab bind:group={tabCurrent} name="settings" value={2}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-tv" /></svelte:fragment>
                Settings
            </Tab>
            <Tab bind:group={tabCurrent} name="advanced" value={3}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-tv" /></svelte:fragment>
                Advanced
            </Tab>
            <!-- Panel -->
            <svelte:fragment slot="panel">
                {#if tabCurrent === 0}
                    <p class="text-center">{desc}</p>
                {:else if tabCurrent === 1}
                    <Attributes id={key} />
                {:else if tabCurrent === 2}
                    <p class="text-center">{desc}</p>
                {:else if tabCurrent === 3}
                    <p class="text-center">{desc}</p>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
{:else}
    <h3>Error: device {key} is unknown.</h3>
{/if}

<style>
</style>
