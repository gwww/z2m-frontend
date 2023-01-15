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
          {#each columns as column}
            {#if column.render}
              <td>{column.render(item[column.id])}</td>
            {:else if column.render_html}
              <td>{@html column.render_html(item[column.id])}</td>
            {:else}
              <td>{item[column.id]}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
