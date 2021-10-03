import React, { useEffect } from 'react';
import { FilterProps, HeaderProps } from 'react-table';
import { TextField } from '@mui/material';

import { camelToWords } from '../../utils/object.utils';

const DefaultHeader = ({ column }: HeaderProps<any>) => (
  <>{column.id.startsWith('_') ? null : camelToWords(column.id)}</>
);

export const defaultColumn = {
  Filter: DefaultColumnFilter,
  Header: DefaultHeader,
  // When using the useFlexLayout:
  minWidth: 80, // minWidth is only used as a limit for resizing
  width: 100, // width is used for both the flex-basis and flex-grow
  maxWidth: 200, // maxWidth is only used as a limit for resizing
};

function DefaultColumnFilter<T extends object>({
  column: { id, index, filterValue, setFilter, render, parent },
}: FilterProps<T>) {
  const [value, setValue] = React.useState(filterValue || '');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };
  // ensure that reset loads the new value
  useEffect(() => {
    setValue(filterValue || '');
  }, [filterValue]);

  const firstIndex = !(parent && parent.index);
  return (
    <TextField
      name={id}
      label={render('Header')}
      value={value}
      autoFocus={index === 0 && firstIndex}
      variant={'standard'}
      onChange={handleChange}
      onBlur={(e) => {
        setFilter(e.target.value || undefined);
      }}
    />
  );
}

export default DefaultColumnFilter;
