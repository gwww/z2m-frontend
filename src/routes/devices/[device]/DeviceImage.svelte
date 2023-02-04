<script lang="ts">
    export let image: string;

    const fallback = '/images/zigbee-logo.png';
    const handleError = (e: Event) => ((<HTMLImageElement>e.target).src = fallback);
    image = `https://www.zigbee2mqtt.io/images/devices/${image.replace('/', '-')}.jpg`;
</script>

<img
    class="h-24 w-24 sm:h-32 sm:w-32 border-slate-400 rounded-xl border-4"
    src={image}
    alt=""
    on:error={handleError}
/>

<style>
</style>
