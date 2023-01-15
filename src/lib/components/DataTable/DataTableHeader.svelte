<script context="module" lang="ts">
  let node: Element;
  const classAsc = 'table-sort-asc';
  const classDsc = 'table-sort-dsc';

  function handleSortEvent(e: Event) {
    if (!(e.target instanceof Element)) return;
    const sortTarget = e.target;

    // Get target state before modification
    const targetAscSorted = sortTarget.classList.contains(classAsc);
    const sortTargetKey = sortTarget.getAttribute('data-sort');
    if (!sortTargetKey) return;

    // Clear asc/dsc classes
    const elemAsc = node.querySelector(`.${classAsc}`);
    if (elemAsc) elemAsc.classList.remove(classAsc);
    const elemDsc = node.querySelector(`.${classDsc}`);
    if (elemDsc) elemDsc.classList.remove(classDsc);

    // Set new sort class
    const classToApply = targetAscSorted ? classDsc : classAsc;
    e.target.classList.add(classToApply);
    sortTable(sortTarget.closest('table')!, Number(sortTargetKey), classToApply === classAsc);
  }

  // Adapted from https://stackoverflow.com/a/55462779
  function sortTable(table: Element, column_number: number, ascending: boolean) {
    // get all the rows from the tbody:
    const tbody = table.querySelector('tbody')!;
    let rows = Array.from(tbody.querySelectorAll('tr'));

    let dir = ascending ? 1 : -1;
    let comparer = (a: any, b: any) => (a < b ? -1 : a > b ? 1 : 0);

    // set up the queryselector for getting the indicated column from a row
    let qs = `td:nth-child(${column_number})`;

    // and then just... sort the rows:
    rows.sort((r1, r2) => {
      let t1 = r1.querySelector(qs)!;
      let t2 = r2.querySelector(qs)!;
      return comparer(t1.textContent, t2.textContent) * dir;
    });

    // and then the magic part that makes the sorting appear on-page:
    rows.forEach((row) => tbody.appendChild(row));
  }
</script>

<script lang="ts">
  import type { Column } from './types';
  export let columns: Column[];

  const sortable = columns.some((col) => col.sort);
</script>

{#if { sortable }}
  <thead
    on:click={(e) => {
      handleSortEvent(e);
    }}
    on:keypress
    bind:this={node}
  >
    <tr>
      {#each columns as item, i}
        {#if item.sort}
          <th data-sort={i + 1}>{item.name}</th>
        {:else}
          <th>{item.name}</th>
        {/if}
      {/each}
    </tr>
  </thead>
{:else}
  <thead>
    <tr>
      {#each columns as item}
        <th>{item.name}</th>
      {/each}
    </tr>
  </thead>
{/if}

<style>
</style>
