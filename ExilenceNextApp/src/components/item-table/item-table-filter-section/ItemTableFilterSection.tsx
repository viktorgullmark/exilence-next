import { observer } from 'mobx-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UiStateStore } from '../../../store/uiStateStore';
import useStyles from './ItemTableFilterSection.styles';
import {
  Box,
  Grid,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@material-ui/core';

export interface IProps {
  uiStateStore?: UiStateStore;
}

const ItemTableFilterSection: React.FC<IProps> = ({ uiStateStore }: IProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const applyFilter = (event: React.FormEvent<HTMLButtonElement>) => {
    // apply
  };
  return (
    <Box mb={1}>
      <Box height={75}>
        <Grid container direction="row" justify="space-between">
          <Grid item>filter</Grid>
          <Grid item>
            <Button size="small" variant="contained" color="primary" onClick={applyFilter}>
              {t('action.apply_filter')}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
};

export default observer(ItemTableFilterSection);
