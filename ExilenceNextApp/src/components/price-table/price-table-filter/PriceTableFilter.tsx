import { Box, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { useFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useStores } from '../../..';
import useStyles from './PriceTableFilter.styles';

export type TableFilterProps = {
  handleFilter: (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  clearFilter: () => void;
};

const PriceTableFilter = ({ handleFilter, clearFilter }: TableFilterProps) => {
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
        size="small"
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
