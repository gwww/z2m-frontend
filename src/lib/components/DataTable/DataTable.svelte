<script lang="ts">
  import type { Column, Styles } from './types';
  import DataTableHeader from './DataTableHeader.svelte';

  export let columns: Column[];
  export let data: Array<any>;
  export let styles: Styles = {};
</script>

<div class={styles.container ?? ''}>
  <table class={styles.table ?? ''}>
    <DataTableHeader {columns} />
    <tbody>
      {#each data as item}
        <tr>
          {#each columns as column, i}
            {#if column.id !== undefined}
              {@const value = column.id === '' ? item : item[column.id]}
              {#if column.render}
                <td>{column.render(value)}</td>
              {:else if column.render_html}
                <td>{@html column.render_html(value)}</td>
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
              {:else}
                <td>{value}</td>
              {/if}
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
