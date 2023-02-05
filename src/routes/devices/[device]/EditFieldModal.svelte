<script lang="ts">
    import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
    import { modalStore } from '@skeletonlabs/skeleton';
    import type { SvelteComponent } from 'svelte';
    import type { Dictionary } from '$lib/types';

    export let modalDialog: typeof SvelteComponent;
    export let props: Dictionary<any>;
    export let title: string;
    export let onsave: (results: Dictionary<string>) => void;

    function modalComponent(): void {
        const component: ModalComponent = {
            ref: modalDialog,
            props,
        };
        const d: ModalSettings = {
            type: 'component',
            title,
            component,
            response: (rsp: Dictionary<string>) => {
                if (rsp) onsave(rsp);
            },
        };
        modalStore.trigger(d);
    }
</script>

<button class="mr-2 text-tertiary-500 mb-1">
    <div
        class="i-mdi-square-edit-outline !h-[24px] !w-[24px] invisible group-hover:visible"
        on:keypress
        on:click={modalComponent}
    />
</button>
