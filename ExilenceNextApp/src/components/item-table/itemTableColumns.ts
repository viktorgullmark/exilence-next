import { Column } from 'react-table';

import { IPricedItem } from '../../interfaces/priced-item.interface';
import {
  itemCorrupted,
  itemIcon,
  itemLinks,
  itemName,
  itemTabs,
  itemValue,
} from '../columns/Columns';

const itemTableColumns: Column<object>[] = [
  itemIcon<IPricedItem>({
    accessor: 'icon',
    header: 'Icon',
  }),
  itemName<IPricedItem>({
    accessor: 'name',
    header: 'Name',
  }),
  {
    Header: 'Item level',
    accessor: 'ilvl',
    align: 'right',
  },
  itemTabs<IPricedItem>({
    accessor: 'tab',
    header: 'Tabs',
  }),
  itemCorrupted<IPricedItem>({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks<IPricedItem>({
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
  itemValue<IPricedItem>({
    accessor: 'calculated',
    header: 'Price',
  }),
  itemValue<IPricedItem>({
    accessor: 'total',
    header: 'Total value',
  }),
];

export default itemTableColumns;
