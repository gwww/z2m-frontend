<script lang="ts">
    const columns = ['Name', 'Email', 'Phone Number'];
    let data = [
        ['John', 'john@example.com', '(353) 01 222 3333'],
        ['Sarah', 'sarah@gmail.com', '(01) 22 888 4444'],
        ['Afshin', 'afshin@mail.com', '(353) 22 87 8356'],
    ];
    let newRow = [...columns];

    const addRow = () => {
        data = [...data, [...newRow]];
        newRow = columns;
    };

    const deleteRow = (rowToBeDeleted: any) => {
        data = data.filter((row) => row != rowToBeDeleted);
    };
</script>

<div class="table-container mt-4">
    <table class="table table-hover">
        <tr>
            {#each columns as column}
                <th>{column}</th>
            {/each}
        </tr>

        {#each data as row}
            <tr>
                {#each row as cell}
                    <td contenteditable="true" bind:innerHTML={cell} />
                {/each}
                <button on:click={() => deleteRow(row)}>X</button>
            </tr>
        {/each}
        <tr style="color: grey">
            {#each newRow as column}
                <td contenteditable="true" bind:innerHTML={column} />
            {/each}
            <button on:click={addRow}>add</button>
        </tr>
    </table>
</div>
<pre>{JSON.stringify(data, null, 2)}</pre>

<style>
    tr td:focus {
        background: #eee;
    }
</style>
