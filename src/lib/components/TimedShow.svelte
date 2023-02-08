<script lang="ts">
    import { onDestroy } from 'svelte';

    export let after = 0;
    export let showFor = 0;

    let timer: ReturnType<typeof setTimeout>;
    let show = true;

    if (after) {
        show = false;
        timer = setTimeout(() => {
            show = true;
            if (showFor) {
                timer = setTimeout(() => (show = false), showFor);
            }
        }, after);
    } else if (showFor) {
        timer = setTimeout(() => (show = false), showFor);
    }
    onDestroy(() => clearTimeout(timer));
</script>

{#if show}
    <slot />
{/if}
