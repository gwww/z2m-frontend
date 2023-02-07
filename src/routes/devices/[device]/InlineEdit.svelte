<!-- Adapted from: https://github.com/PaulMaly/svelte-inline-edit -->
<script context="module" lang="ts">
    export interface SaveResult {
        value: string;
        toggleChecked: boolean;
    }
    export interface saveCallback {
        (result: SaveResult): Promise<void>;
    }
</script>

<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';

    export let value = '';
    export let rows = 1;
    export let options: string[] = [];
    export let promise: Promise<void> | undefined = undefined;
    export let toggle: string = '';
    export let callback: saveCallback;

    let readonly = true,
        input: any,
        toggleChecked = false,
        attrs: any,
        list: number;

    $: options.length && (list = Date.now());
    $: {
        const { value, rows, options, ...other } = $$props;
        attrs = other;
    }

    function edit() {
        readonly && (readonly = false);
    }

    function cancel() {
        console.log('cancel called');
        input.value = value;
        readonly = true;
    }

    async function save() {
        readonly = true;
        value = input.value;
        promise = callback({ value, toggleChecked });
    }
</script>

<svelte:body on:click={cancel} />

<div class="editable w-full">
    {#if rows > 1}
        <textarea
            bind:this={input}
            on:click|self|stopPropagation={edit}
            {...attrs}
            {readonly}
            {value}
            {rows}
            {list}
        />
    {:else}
        <input
            bind:this={input}
            on:click|self|stopPropagation={edit}
            {...attrs}
            {readonly}
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

    {#if !readonly}
        <div class="flex items-center gap-2 mt-1">
            {#if toggle}
                <span class="text-xs">{toggle}</span>
                <span class="h-6 mr-2" on:click|stopPropagation on:keypress>
                    <SlideToggle
                        bind:checked={toggleChecked}
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
    {#if promise}
        {#await promise}
            <!--     Updating... -->
            <!-- {:then success} -->
            <!--     <span style="color: green;">Updated</span> -->
            <!-- {:catch error} -->
            <!--     <span style="color: red;">Error</span> -->
        {/await}
    {/if}
</div>

<style>
    .editable {
        position: relative;
        display: inline-block;
        overflow: visible;
    }
    .editable div {
        position: absolute;
        overflow: visible;
        right: 0;
    }

    [readonly]:hover {
        cursor: pointer !important;
    }
</style>
