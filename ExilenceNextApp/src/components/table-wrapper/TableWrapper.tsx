import { observer } from 'mobx-react';
import React from 'react';
import useStyles from './TableWrapper.styles';

interface IProps<T> {
  data: T[];
}

function TableWrapper<T>({ data }: IProps<T>) {
    return null;
}

export default observer(TableWrapper);
