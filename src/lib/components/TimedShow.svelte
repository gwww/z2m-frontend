<script lang="ts">
    import { onDestroy } from 'svelte';

    export let after = 0;
    export let showFor = 0;
    export let doneCallback: () => void | undefined = () => {};

    let timer: ReturnType<typeof setTimeout>;
    let show = true;

    if (after) {
        show = false;
        timer = setTimeout(() => {
            show = true;
            if (showFor) {
                timer = setTimeout(() => done(), showFor);
            }
        }, after);
    } else if (showFor) {
        timer = setTimeout(() => done(), showFor);
    }

    const done = () => {
        show = false;
        doneCallback();
    };

    onDestroy(() => {
        clearTimeout(timer);
    });
</script>

{#if show}
    <slot />
{/if}
