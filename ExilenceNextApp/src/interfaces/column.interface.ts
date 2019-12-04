export interface IColumn {
  id:
    | 'icon'
    | 'name'
    | 'links'
    | 'quality'
    | 'level'
    | 'corrupted'
    | 'stackSize'
    | 'calculated'
    | 'total';
  label: string;
  numeric?: boolean;
  minWidth?: number;
  maxWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}
