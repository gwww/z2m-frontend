<script lang="ts">
    import { setContext } from 'svelte';
    import { page } from '$app/stores';
    import { writable, type Writable } from 'svelte/store';
    import { TabGroup, Tab } from '@skeletonlabs/skeleton';

    import * as MQTT from '$lib/mqtt';
    import { devices } from '$lib/mqtt';

    import InlineEdit from '$components/InlineEdit.svelte';
    import type { SaveResult } from '$components/InlineEdit.svelte';
    import Attributes from './Attributes.svelte';
    import DeviceImage from './DeviceImage.svelte';
    import StatePanel from './StatePanel.svelte';
    import ListFeature from './ListFeature.svelte';
    import type {
        ConfigInfoDevice,
        ConsolidatedDevice,
        Device,
        DeviceState,
        Maybe,
    } from '$lib/types';

    let currentTab: string = 'state';
    const lorem =
        'Lorem ipsum dolor sit amet, officia excepteur ex fugiat reprehenderit enim labore culpa sint ad nisi Lorem pariatur mollit ex esse exercitation amet. Nisi anim cupidatat excepteur officia. Reprehenderit nostrud nostrud ipsum Lorem est aliquip amet voluptate voluptate dolor minim nulla est proident. Nostrud officia pariatur ut officia. Sit irure elit esse ea nulla sunt ex occaecat reprehenderit commodo officia dolor Lorem duis laboris cupidatat officia voluptate. Culpa proident adipisicing id nulla nisi laboris ex in Lorem sunt duis officia eiusmod. Aliqua reprehenderit commodo ex non excepteur duis sunt velit enim. Voluptate laboris sint cupidatat ullamco ut ea consectetur et est culpa et culpa duis.';

    const key = $page.params.device;
    let dev: Maybe<ConsolidatedDevice>;
    let device_model: Maybe<Device>;
    let device: Maybe<ConfigInfoDevice>;
    let state_store: Writable<DeviceState | undefined> = writable(undefined);
    setContext('state', state_store);
    setContext('id', key);

    $: {
        dev = $devices.find((d) => d.ieee_address === key);
        device_model = dev?.device;
        device = dev?.config_info;
        $state_store = dev?.state;
    }

    function updateFriendlyname(result: SaveResult): Promise<string> {
        // device is null checked in markup section
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return MQTT.rename(device!.friendly_name, result.value, result.toggleChecked);
    }

    function updateDescription(result: SaveResult): Promise<string> {
        return MQTT.set_description(key, result.value);
    }
</script>

{#if device && device_model}
    <div class="card p-4 space-y-8">
        <div class="flex flex-wrap gap-4 justify-center flex-col sm:flex-row">
            <DeviceImage image={device_model.definition.model || ''} />

            <div class="w-full md:w-3/5 lg:w-2/5">
                <InlineEdit
                    class="input text-2xl"
                    type="text"
                    placeholder="Name..."
                    value={device.friendly_name}
                    toggle={'Update Home Assistant Entity'}
                    saveCallback={updateFriendlyname}
                />
                <InlineEdit
                    class="input text-sm"
                    type="text"
                    placeholder="Description..."
                    value={device.description || ''}
                    saveCallback={updateDescription}
                />
            </div>
        </div>

        <TabGroup
            justify="justify-center"
            active="border-b-4 border-primary-500"
            hover="hover:variant-soft-primary"
        >
            <!-- Tabs -->
            <Tab bind:group={currentTab} name="state" value={'state'}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-book" /></svelte:fragment>
                State
            </Tab>
            <Tab bind:group={currentTab} name="attributes" value={'attributes'}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-film" /></svelte:fragment>
                Attributes
            </Tab>
            <Tab bind:group={currentTab} name="settings" value={'settings'}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-tv" /></svelte:fragment>
                Settings
            </Tab>
            <Tab bind:group={currentTab} name="advanced" value={'advanced'}>
                <svelte:fragment slot="lead"><i class="fa-solid fa-tv" /></svelte:fragment>
                Advanced
            </Tab>
            <svelte:fragment slot="panel">
                {#if currentTab === 'state'}
                    <StatePanel id={key} />
                {:else if currentTab === 'attributes'}
                    <Attributes id={key} />
                {:else if currentTab === 'settings'}
                    <ListFeature />
                {:else if currentTab === 'advanced'}
                    <p>{lorem}</p>
                {/if}
            </svelte:fragment>
        </TabGroup>
    </div>
{:else}
    <p class="!text-2xl">Loading device {key} from MQTT...</p>
{/if}
