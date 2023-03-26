<script lang="ts">
    const columns = ['Name', 'Email', 'Phone Number'];
    let data = [
        ['John', 'john@example.com', '(353) 01 222 3333'],
        ['Sarah', 'sarah@gmail.com', '(01) 22 888 4444'],
        ['Afshin', 'afshin@mail.com', '(353) 22 87 8356'],
    ];
    let newRow = [...columns];

    const addRow = () => {
        data = [...data, ['', '', '']];
        // newRow = columns;
    };

    const deleteRow = (rowToBeDeleted: any) => {
        data = data.filter((row) => row != rowToBeDeleted);
    };
</script>

<div class="table-container pt-4 px-8">
    <table class="table table-interactive">
        <thead>
            <tr>
                {#each columns as column}
                    <th>{column}</th>
                {/each}
                <button on:click={addRow} class="bg-success-500 rounded-sm px-1 mt-4">&plus;</button
                >
            </tr>
        </thead>

        <tbody>
            {#each data as row}
                <tr>
                    {#each row as cell}
                        <td contenteditable="true" bind:innerHTML={cell} />
                    {/each}
                    <button
                        class="bg-error-500 rounded-sm px-1 mt-3"
                        on:click={() => deleteRow(row)}>&cross;</button
                    >
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<!-- <pre>{JSON.stringify(data, null, 2)}</pre> -->

<!-- CSS adapted from https://htmldom.dev/placeholder-for-a-contenteditable-element/ -->
<style>
    [contenteditable='true']:active,
    [contenteditable='true']:focus {
        border: none;
        outline: none;
        backdrop-filter: brightness(80%);
    }
    [contenteditable]:empty:before {
        /* content: attr(data-placeholder); */
        content: 'Edit me';
        filter: contrast(0);
    }
</style>
