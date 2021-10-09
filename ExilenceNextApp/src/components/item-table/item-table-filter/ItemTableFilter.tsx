import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';

import { IPricedItem } from '../../../interfaces/priced-item.interface';
import useStyles from './ItemTableFilter.styles';
import clsx from 'clsx';

export type TableFilterProps<T> = {
  array: T[];
  handleFilter: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  clearFilter: () => void;
  searchText: string;
};

const ItemTableFilter = ({
  handleFilter,
  clearFilter,
  searchText = '',
}: TableFilterProps<IPricedItem>) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      searchText,
    },

    onSubmit: (): void => {
      /* do nothing */
    },

    validationSchema: Yup.object().shape({
      searchText: Yup.string().max(20),
    }),
  });

  return (
    <form onSubmit={formik.handleSubmit} className={classes.grow}>
      <TextField
        margin="dense"
        variant="outlined"
        onChange={(e) => {
          formik.handleChange(e);
          handleFilter(e);
        }}
        name="searchText"
        size="small"
        placeholder={t('tables:label.search_text')}
        className={clsx(classes.searchField, classes.grow)}
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

export default observer(ItemTableFilter);
