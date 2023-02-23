<!-- Adapted from: https://github.com/PaulMaly/svelte-inline-edit -->
<script context="module" lang="ts">
    export interface SaveResult {
        value: string;
        toggleChecked: boolean;
    }
    export interface _saveCallback {
        (result: SaveResult): Promise<string>;
    }
</script>

<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import RequestStatus from '$lib/components/RequestStatus.svelte';

    export let value = '';
    export let rows = 1;
    export let options: string[] = [];
    export let promise: Promise<string> | undefined = undefined;
    export let toggle = '';
    export let saveCallback: _saveCallback;

    let i_readonly = true,
        input: HTMLTextAreaElement | HTMLInputElement,
        toggleChecked = false,
        attrs: any,
        list: number;

    $: options.length && (list = Date.now());
    $: {
        const { value, rows, options, ...other } = $$props;
        attrs = other;
    }

    function edit() {
        i_readonly = false;
        promise = undefined;
    }

    function cancel() {
        console.log('cancel');
        if (!i_readonly) {
            input.value = value;
            i_readonly = true;
        }
    }

    async function save() {
        i_readonly = true;
        value = input.value;
        promise = saveCallback({ value, toggleChecked });
        console.log('saving');
    }

    let name: string;
</script>

<svelte:body on:click={cancel} />

<div class="controls w-full">
    {#if rows > 1}
        <textarea
            bind:this={input}
            on:click|self|stopPropagation={edit}
            {...attrs}
            {i_readonly}
            {value}
            {rows}
            {list}
        />
    {:else}
        <input
            bind:this={input}
            on:click|self|stopPropagation={edit}
            {...attrs}
            {i_readonly}
            {value}
            {list}
        />
    {/if}

    {#if options.length}
        <datalist id={list.toString()}>
            {#each options as value}
                <option {value} />
            {/each}
        </datalist>
    {/if}

    {#if !i_readonly}
        <div class="flex items-center gap-2 mt-1 z-30">
            {#if toggle}
                <span class="text-xs">{toggle}</span>
                <span class="h-6 mr-2" on:click|stopPropagation on:keypress>
                    <SlideToggle
                        bind:checked={toggleChecked}
                        {name}
                        class="scale-80"
                        size="sm"
                        accent="bg-primary-500"
                    />
                </span>
            {/if}
            <button
                class="bg-success-500 px-1 text-sm"
                on:click|self|stopPropagation={save}
                type="button"
            >
                <slot name="save">&check;</slot>
            </button>
            <button
                class="bg-error-500 px-1 text-sm"
                on:click|self|stopPropagation={cancel}
                type="button"
            >
                <slot name="cancel">&cross;</slot>
            </button>
        </div>
    {/if}

    <RequestStatus {promise} show={i_readonly} />
</div>

<style>
    .controls {
        width: 100%;
        position: relative;
        margin-bottom: 2px;
    }
    .controls div {
        position: absolute;
        right: 0;
    }
    [i_readonly]:hover {
        cursor: pointer !important;
    }
    [i_readonly] {
        border-width: 1px !important;
    }
</style>
