<script lang="ts">
  import type { Column } from './types';
  export let columns: Column[];
  export let data: Array<any>;
</script>

<div class="table-container mt-8">
  <table class="table table-hover">
    <thead>
      <tr>
        {#each columns as item}
          <th>{item.name}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as item}
        <tr>
          {#each columns as column, i}
            {#if columns[i].render === undefined}
              <td>{item[column.id]}</td>
            {:else}
              <td>{@html column.render(item[column.id])}</td>
            {/if}
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
</style>
