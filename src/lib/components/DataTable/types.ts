export interface Column {
    name: string;
    id?: string;
    render?(cell: any): string;
    render_html?(cell: any): string;
    sort?: boolean;
}

export interface Styles {
    container?: string;
    table?: string;
}
