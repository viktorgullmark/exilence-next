import { Column } from 'react-table';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { itemCorrupted, itemIcon, itemLinks, itemName, itemValue } from '../columns/Columns';

const itemTableColumns: Column<object>[] = [
  itemIcon<IExternalPrice>({
    accessor: 'icon',
    header: 'Icon',
  }),
  itemName<IExternalPrice>({
    accessor: 'name',
    header: 'Name',
  }),
  {
    Header: 'Item level',
    accessor: 'ilvl',
    align: 'right',
  },
  itemCorrupted<IExternalPrice>({
    accessor: 'corrupted',
    header: 'Corrupted',
  }),
  itemLinks<IExternalPrice>({
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
  itemValue<IExternalPrice>({
    accessor: 'calculated',
    header: 'Price',
  }),
  itemValue<IExternalPrice>({
    accessor: 'customPrice',
    header: 'Custom price',
    editable: true,
    placeholder: 'Not set',
  }),
];

export default itemTableColumns;
