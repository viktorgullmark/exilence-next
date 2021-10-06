import { Column } from 'react-table';
import {
  itemCell,
  itemCorrupted,
  itemIcon,
  itemIlvlTier,
  itemLinks,
  itemName,
  itemValue,
  sparkLine,
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
  itemCell({
    header: 'Variant',
    accessor: 'variant',
  }),
  itemCorrupted({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks({
    accessor: 'links',
    header: 'Links',
  }),
  itemCell({
    header: 'Quality',
    accessor: 'quality',
    align: 'right',
  }),
  itemCell({
    header: 'Level',
    accessor: 'level',
    align: 'right',
  }),
  sparkLine({
    accessor: 'sparkLine.totalChange',
    header: 'Price last 7 days',
  }),
  itemValue({
    accessor: 'calculated',
    header: 'Price',
    placeholder: 'No data',
  }),
  itemValue({
    accessor: 'customPrice',
    header: 'Custom price',
    editable: true,
    placeholder: 'Not set',
  }),
];

export default itemTableColumns;
