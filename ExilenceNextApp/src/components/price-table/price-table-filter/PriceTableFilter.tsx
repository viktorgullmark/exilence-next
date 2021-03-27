import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';

import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './PriceTableFilter.styles';
import { useStores } from '../../..';

export type TableFilterProps<T> = {
  handleFilter: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  clearFilter: () => void;
};

const PriceTableFilter = ({ handleFilter, clearFilter }: TableFilterProps<IPricedItem>) => {
  const { uiStateStore } = useStores();
  const { t } = useTranslation();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      searchText: uiStateStore!.priceTableFilterText,
    },

    onSubmit: (): void => {
      /* do nothing */
    },

    validationSchema: Yup.object().shape({
      searchText: Yup.string().max(20),
    }),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <TextField
        margin="dense"
        variant="outlined"
        onChange={(e) => {
          formik.handleChange(e);
          handleFilter(e);
        }}
        name="searchText"
        placeholder={t('tables:label.search_text')}
        className={classes.searchField}
        value={formik.values.searchText}
        InputProps={{
          classes: {
            input: classes.inputField,
          },
          startAdornment: (
            <Box mr={1} display="flex" justifyContent="center" alignItems="center">
              <SearchIcon />
            </Box>
          ),
          endAdornment: (
            <>
              {formik.values.searchText !== '' && (
                <IconButton
                  aria-label="help"
                  title={t('label.clear_search_icon_title')}
                  className={classes.clearIcon}
                  edge="start"
                  size="small"
                  onClick={() => {
                    formik.setFieldValue('searchText', '');
                    clearFilter();
                  }}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </>
          ),
        }}
      />
    </form>
  );
};

export default observer(PriceTableFilter);
