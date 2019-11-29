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
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }