<script lang="ts">
    export let title = '';
</script>

<div class="px-4 mt-4 col-span-full">
    {#if title}
        <p class="p-1 !text-xl">{title}</p>
        <hr />
    {/if}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <slot />
    </div>
</div>
