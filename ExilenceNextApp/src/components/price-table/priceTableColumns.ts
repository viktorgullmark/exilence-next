import { Column } from 'react-table';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import {
  itemCell,
  itemCorrupted,
  itemIcon,
  itemLinks,
  itemName,
  itemValue,
} from '../columns/Columns';

const itemTableColumns: Column<object>[] = [
  itemIcon<IExternalPrice>({
    accessor: 'icon',
    header: 'Icon',
  }),
  itemName<IExternalPrice>({
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
  itemCorrupted<IExternalPrice>({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks<IExternalPrice>({
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
  itemValue<IExternalPrice>({
    accessor: 'calculated',
    header: 'Price',
    placeholder: 'No data',
  }),
  itemValue<IExternalPrice>({
    accessor: 'customPrice',
    header: 'Custom price',
    editable: true,
    placeholder: 'Not set',
  }),
];

export default itemTableColumns;
