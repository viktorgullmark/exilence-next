import { Column } from 'react-table';
import {
  itemCorrupted,
  itemIcon,
  itemIlvlTier,
  itemLinks,
  itemName,
  itemTabs,
  itemValue,
} from '../columns/Columns';

const itemTableColumns: Column<object>[] = [
  itemIcon({
    accessor: 'icon',
    header: 'Icon',
  }),
  itemName({
    accessor: 'name',
    header: 'Name',
  }),
  itemIlvlTier({
    accessor: (row: any) => (row.tier > 0 ? row.tier : row.ilvl),
    header: 'Ilvl / Tier',
  }),
  itemTabs({
    accessor: 'tab',
    header: 'Tabs',
  }),
  itemCorrupted({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks({
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
  itemValue({
    accessor: 'calculated',
    header: 'Price',
  }),
  itemValue({
    accessor: 'total',
    header: 'Total value',
  }),
];

export default itemTableColumns;
