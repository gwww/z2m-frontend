<script lang="ts">
    import type { Column, Styles } from './types';
    import DataTableHeader from './DataTableHeader.svelte';

    export let columns: Column[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export let data: Array<any>;
    export let styles: Styles = {};
    export let tableId = '';
</script>

<div class={styles.container ?? ''}>
    <table id={tableId} class={styles.table ?? ''}>
        <DataTableHeader {columns} />
        <tbody>
            {#each data as item}
                <tr>
                    {#each columns as column, i}
                        {#if !column.hidden}
                            {#if column.id !== undefined}
                                {@const value = column.id === '' ? item : item[column.id]}
                                {#if column.render}
                                    <td>{column.render(value)}</td>
                                {:else if column.render_html}
                                    <td>{@html column.render_html(value)}</td>
                                {:else if column.component}
                                    {@const c = column.component(value)}
                                    <td><svelte:component this={c.comp} {...c.props} /></td>
                                {:else}
                                    <td>{value}</td>
                                {/if}

                                <!-- Array data... -->
                            {:else}
                                {@const value = item[i]}
                                {#if column.render}
                                    <td>{column.render(value)}</td>
                                {:else if column.render_html}
                                    <td>{@html column.render_html(value)}</td>
                                {:else if column.component}
                                    {@const c = column.component(value)}
                                    <td><svelte:component this={c.comp} {...c.props} /></td>
                                {:else}
                                    <td>{value}</td>
                                {/if}
                            {/if}
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>
