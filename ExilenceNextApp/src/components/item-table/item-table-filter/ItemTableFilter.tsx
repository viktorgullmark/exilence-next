import { TextField, IconButton, Box } from '@material-ui/core';
import { Formik } from 'formik';
import { observer } from 'mobx-react';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilter.styles';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';

export interface TableFilterProps<T> {
  array: T[];
  handleFilter: (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
  clearFilter: () => void;
}

const ItemTableFilter: React.FC<TableFilterProps<IPricedItem>> = ({
  array,
  handleFilter,
  clearFilter
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
        const { values, setFieldValue, handleChange } = formProps;

        return (
          <form>
            <TextField
              margin="dense"
              variant="outlined"
              onChange={e => {
                handleChange(e);
                handleFilter(e);
              }}
              name="searchText"
              // label={t('tables:label.search_text')}
              className={classes.searchField}
              value={values.searchText}
              InputProps={{
                startAdornment: (
                  <Box mr={1} display="flex" justifyContent="center" alignItems="center">
                    <SearchIcon />
                  </Box>
                ),
                endAdornment: (
                  <>
                    {values.searchText !== '' && (
                      <IconButton
                        aria-label="help"
                        title={t('label.clear_search_icon_title')}
                        className={classes.clearIcon}
                        edge="start"
                        size="small"
                        onClick={e => {
                          setFieldValue('searchText', '');
                          clearFilter();
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </>
                )
              }}
            />
          </form>
        );
      }}
    </Formik>
  );
};

export default observer(ItemTableFilter);
