<!-- Adapted from: https://github.com/PaulMaly/svelte-inline-edit -->
<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { SlideToggle } from '@skeletonlabs/skeleton';

    const dispatch = createEventDispatcher();

    export let value = '';
    export let rows = 1;
    export let options: string[] = [];
    export let toggle: string = '';

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
        dispatch('edit', input);
    }

    function cancel() {
        input.value = value;
        readonly = true;
        dispatch('cancel', input);
    }

    function save() {
        readonly = true;
        value = input.value;
        dispatch('save', { value, toggleChecked });
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
