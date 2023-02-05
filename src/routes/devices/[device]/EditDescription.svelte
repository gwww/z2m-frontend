<script lang="ts">
    import { modalStore } from '@skeletonlabs/skeleton';

    export let parent: any;
    export let description: string;

    function onFormSubmit(): void {
        if ($modalStore[0].response) $modalStore[0].response({ description });
        modalStore.close();
    }

    const cBase = 'space-y-4';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<div class="modal-example-form {cBase}">
    <form class="modal-form {cForm}">
        <label class="input-label">
            <span>Description</span>
            <input type="text" bind:value={description} placeholder="Enter description..." />
        </label>
    </form>
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Save</button>
    </footer>
</div>
