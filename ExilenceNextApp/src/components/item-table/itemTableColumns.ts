import { Column } from 'react-table';
import { ITableItem } from '../../interfaces/table-item.interface';
import { itemCorrupted, itemIcon, itemLinks, itemName, itemValue } from '../table-wrapper/Columns';

const itemTableColumns: Column<object>[] = [
  itemIcon<ITableItem>({
    accessor: 'icon',
    header: 'Icon',
  }),
  itemName<ITableItem>({
    accessor: 'name',
    header: 'Name',
  }),
  {
    Header: 'Item level',
    accessor: 'ilvl',
    align: 'right',
  },
  {
    Header: 'Tabs',
    accessor: 'tabNames',
  },
  itemCorrupted<ITableItem>({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks<ITableItem>({
    accessor: 'links',
    header: 'Links',
  }),
  {
    Header: 'Quality',
    accessor: 'quality',
    align: 'right',
  },
  {
    Header: 'Level',
    accessor: 'level',
    align: 'right',
  },
  {
    Header: 'Quantity',
    accessor: 'stackSize',
    align: 'right',
  },
  itemValue<ITableItem>({
    accessor: 'calculated',
    header: 'Price',
  }),
  itemValue<ITableItem>({
    accessor: 'total',
    header: 'Total value',
  }),
];

export default itemTableColumns;
