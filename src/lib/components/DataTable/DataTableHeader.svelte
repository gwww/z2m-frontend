<!-- </script> -->
<script lang="ts">
    import type { Column } from './types';
    import { classAsc, sortEvent } from './DataTableHeader';
    export let columns: Column[];

    const sortable = columns.some((col) => col.sort);
    const sort_order = 'none';
</script>

{#if { sortable }}
    <thead
        on:click={(e) => {
            sortEvent(e);
        }}
        on:keypress
    >
        <tr>
            {#each columns as column, i}
                {#if !column.hidden}
                    {#if column.sort}
                        <th data-sort={i + 1} aria-sort={sort_order} class={classAsc}
                            >{column.name}</th
                        >
                    {:else}
                        <th>{column.name}</th>
                    {/if}
                {/if}
            {/each}
        </tr>
    </thead>
{:else}
    <thead>
        <tr>
            {#each columns as column}
                {#if !column.hidden}
                    <th>{column.name}</th>
                {/if}
            {/each}
        </tr>
    </thead>
{/if}

<style>
    .table-asc::after {
        content: '↓' !important;
        margin-left: 0.5rem;
        visibility: hidden;
        opacity: 50%;
    }
    .table-dsc::after {
        content: '↑' !important;
        margin-left: 0.5rem;
        visibility: hidden;
        opacity: 50%;
    }
    .table-asc[aria-sort='ascending']::after {
        visibility: visible;
    }
    .table-dsc[aria-sort='descending']::after {
        visibility: visible;
    }
</style>
