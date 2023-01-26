<script lang="ts">
    type flipType = 'none' | 'both' | 'vertical' | 'horizontal';

    export let path: string = '';
    export let size: number = 24;
    export let viewbox: string = '0 0 24 24';
    export let flip: flipType = 'none';
    export let rotate: string = '';

    let style_ = '';
    if (flip !== 'none') {
        style_ = `scale(${['both', 'horizontal'].includes(flip) ? -1 : 1}, ${
            ['both', 'vertical'].includes(flip) ? -1 : 1
        })`;
    }
    if (rotate) {
        style_ += ` rotate(${rotate})`;
    }
</script>

<svg width={size} height={size} viewBox={viewbox} style={style_} {...$$restProps}>
    <path d={path} />
</svg>

<style>
    path {
        fill: currentColor;
    }
</style>
