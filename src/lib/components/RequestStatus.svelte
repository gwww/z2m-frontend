<script lang="ts">
    import TimedShow from '$lib/components/TimedShow.svelte';

    export let promise: Promise<string> | undefined;
    export let show = true;

    const doneCallback = () => {
        promise = undefined;
    };
</script>

<br />
<div class="message">
    {#if promise && show}
        {#await promise}
            <TimedShow after={250}
                ><div class="left-3 mt-1 text-sm text-tertiary-500">Updating...</div></TimedShow
            >
        {:then success}
            <TimedShow showFor={2500} {doneCallback}
                ><div class="left-3 mt-1 text-sm text-success-500">
                    Updated {success}
                </div></TimedShow
            >
        {:catch error}
            <TimedShow showFor={10000} {doneCallback}
                ><div class="left-3 mt-1 text-sm text-error-500">{error}</div></TimedShow
            >
        {/await}
    {/if}
</div>

<style>
    .message {
        height: 20px;
        width: 100%;
        position: relative;
        display: inline-block;
    }
    .message div {
        position: absolute;
        margin: 0;
        padding: 0;
    }
</style>
