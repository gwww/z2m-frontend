<script lang="ts">
    export let tableId: string;

    // Adapted from: https://stackoverflow.com/a/51187875
    function filterTable(e: Event) {
        const table_rows = document.querySelectorAll(`#${tableId} tbody tr`);
        const filter = (<HTMLInputElement>e.target).value;

        const regex = new RegExp(filter, 'i');
        const isFoundInTds = (td: Element) => regex.test(td.innerHTML);
        const isFound = (childrenArr: Element[]) => childrenArr.some(isFoundInTds);
        const setTrStyleDisplay = (row: Element) => {
            (<HTMLElement>row).style.display = isFound([...row.children]) ? '' : 'none';
        };
        table_rows.forEach(setTrStyleDisplay);
    }

    let name: string;
</script>

<input
    class="input"
    {name}
    type="text"
    on:keyup={(e) => {
        filterTable(e);
    }}
    placeholder="Filter..."
    title="Filter items"
/>

<style>
</style>
