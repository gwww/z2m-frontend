import type { ComponentProps, ComponentType, } from "svelte";

export interface Component {
    comp: ComponentType;
    props?: ComponentProps<any>;
}

export interface Column {
    name: string;
    id?: string;
    render?(cell: any): string;
    render_html?(cell: any): string;
    sort?: boolean;
    hidden?: boolean;
    component?(cell: any): Component;
}

export interface Styles {
    container?: string;
    table?: string;
}
