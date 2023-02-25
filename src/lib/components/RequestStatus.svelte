<script lang="ts">
    import TimedShow from '$lib/components/TimedShow.svelte';

    export let promise: Promise<string> | undefined;
    export let show = true;

    const doneCallback = () => {
        promise = undefined;
    };
</script>

<div class="message">
    {#if promise && show}
        {#await promise}
            <TimedShow after={250}
                ><div class="mt-1 text-sm text-tertiary-500">Updating...</div></TimedShow
            >
        {:then success}
            <TimedShow showFor={2500} {doneCallback}
                ><div class="mt-1 text-sm text-success-500">Updated</div></TimedShow
            >
        {:catch error}
            <TimedShow showFor={10000} {doneCallback}
                ><div class="mt-1 text-sm text-error-500">{error}</div></TimedShow
            >
        {/await}
    {/if}
</div>

<style>
    .message {
        height: 24px;
        width: 100%;
        position: relative;
        display: inline-block;
        z-index: 10;
    }
    .message div {
        position: absolute;
        margin: 0;
        padding: 0;
    }
</style>
