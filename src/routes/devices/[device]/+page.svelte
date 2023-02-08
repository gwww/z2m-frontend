<script lang="ts">
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';
    import { page } from '$app/stores';

    import * as MQTT from '$lib/mqtt';
    import { bridge_info, devices, device_states } from '$lib/mqtt';
    import type { Device, DeviceState } from '$lib/types';

    import DeviceImage from './DeviceImage.svelte';
    import InlineEdit from './InlineEdit.svelte';
    import type { SaveResult } from './InlineEdit.svelte';
    import Attributes from './Attributes.svelte';

    let tabCurrent: number = 0;
    let desc = {
        books: 'A written or printed work consisting of pages glued or sewn together along one side and bound in covers.',
        movies: 'A story or event recorded by a camera as a set of moving images and shown in a theater or on television; a motion picture.',
        tv: 'A system for transmitting visual images and sound to screens, chiefly for entertainment, information, and education.',
    };

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
                    <p class="text-center">{desc.books}</p>
                {:else if tabCurrent === 1}
                    <Attributes id={key} />
                {:else if tabCurrent === 2}
                    <p class="text-center">{desc.tv}</p>
                {:else if tabCurrent === 3}
                    <p class="text-center">{desc.tv}</p>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
{:else}
    <h3>Error: device {key} is unknown.</h3>
{/if}

<style>
</style>
