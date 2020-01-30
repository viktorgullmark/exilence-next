import { TextField } from '@material-ui/core';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilter.styles';

export interface TableFilterProps<T> {
  array: T[];
  handleFilter: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const ItemTableFilter: React.FC<TableFilterProps<IPricedItem>> = ({
  array,
  handleFilter
}: TableFilterProps<IPricedItem>) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        searchText: ''
      }}
      onSubmit={(values: { searchText: string }) => {}}
      validationSchema={Yup.object().shape({
        searchText: Yup.string().max(20)
      })}
    >
      {/* todo: refactor and use new formik */}
      {(formProps: any) => {
        const { values, handleChange } = formProps;

        return (
          <form>
            <TextField
              onChange={e => {
                handleChange(e);
                handleFilter(e);
              }}
              id="search-text"
              label={t('tables:label.search_text')}
              className={classes.searchField}
            />
          </form>
        );
      }}
    </Formik>
  );
};

export default observer(ItemTableFilter);
