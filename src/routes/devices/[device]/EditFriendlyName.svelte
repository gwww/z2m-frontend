<script lang="ts">
    import { SlideToggle } from '@skeletonlabs/skeleton';

    // Props
    /** Exposes parent props to this component. */
    export let parent: any;
    export let name: string;

    // Stores
    import { modalStore } from '@skeletonlabs/skeleton';

    const formData = {
        name: name,
        update_home_assistant: false,
    };

    function onFormSubmit(): void {
        if ($modalStore[0].response) $modalStore[0].response(formData);
        modalStore.close();
    }

    const cBase = 'space-y-4';
    const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';
</script>

<div class="modal-example-form {cBase}">
    <!-- Enable for debugging: -->
    <!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
    <form class="modal-form {cForm}">
        <label class="input-label">
            <span>Name</span>
            <input type="text" bind:value={formData.name} placeholder="Enter name..." />
        </label>
        <SlideToggle bind:checked={formData.update_home_assistant}
            >Update Home Assistant Entity name</SlideToggle
        >
    </form>
    <!-- prettier-ignore -->
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onFormSubmit}>Save</button>
    </footer>
</div>
