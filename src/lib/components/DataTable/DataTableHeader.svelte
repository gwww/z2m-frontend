<script context="module" lang="ts">
  const classAsc = 'table-asc';
  const classDsc = 'table-dsc';

  function handleSortEvent(e: Event) {
    if (!(e.target instanceof Element)) return;
    const sortTarget = e.target as HTMLElement;
    const node = sortTarget.closest('thead')!;

    // Set desired new sort order
    const sortAscending = sortTarget.getAttribute('aria-sort') !== 'ascending';
    const sortColumn = sortTarget.getAttribute('data-sort');
    if (!sortColumn) return;

    node.querySelectorAll<HTMLElement>(`.${classAsc}, .${classDsc}`).forEach((el) => {
      el.setAttribute('aria-sort', 'none');
    });

    sortTarget.classList.remove(classAsc);
    sortTarget.classList.remove(classDsc);
    sortTarget.classList.add(sortAscending ? classAsc : classDsc);
    sortTarget.setAttribute('aria-sort', sortAscending ? 'ascending' : 'descending');

    sortTable(sortTarget.closest('table')!, Number(sortColumn), sortAscending);
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
  >
    <tr>
      {#each columns as item, i}
        {#if item.sort}
          <th data-sort={i + 1} aria-sort="none" class={classAsc}>{item.name}</th>
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
  .table-asc::after {
    content: '↓';
    margin-left: 0.5rem;
    visibility: hidden;
    opacity: 50%;
  }
  .table-dsc::after {
    content: '↑';
    margin-left: 0.5rem;
    visibility: hidden;
    opacity: 50%;
  }
  .table-asc:global([aria-sort='ascending'])::after {
    visibility: visible;
  }
  .table-dsc:global([aria-sort='descending'])::after {
    visibility: visible;
  }
</style>
