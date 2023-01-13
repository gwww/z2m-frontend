export interface Column {
  name: string;
  id: string;
  render?(cell: any): string;
}
