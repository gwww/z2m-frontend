import type { ComponentProps, ComponentType } from 'svelte';

export interface Component {
    comp: ComponentType;
    props?: ComponentProps<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Column {
    name: string;
    id?: string;
    render?(cell: any): string; // eslint-disable-line @typescript-eslint/no-explicit-any
    render_html?(cell: any): string; // eslint-disable-line @typescript-eslint/no-explicit-any
    sort?: boolean;
    hidden?: boolean;
    component?(cell: any): Component; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface Styles {
    container?: string;
    table?: string;
}
