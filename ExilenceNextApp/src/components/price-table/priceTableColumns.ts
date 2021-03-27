import { Column } from 'react-table';
import {
  itemCell,
  itemCorrupted,
  itemIcon,
  itemLinks,
  itemName,
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
  itemCell({
    header: 'Item level',
    accessor: 'ilvl',
    align: 'right',
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
