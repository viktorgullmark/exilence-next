import { LocalizationProvider, TimePicker } from '@mui/lab';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './ManualAdjustmentDialogDialog.styles';
import moment from 'moment';
import { getMillisecondsFromMoment } from '../../utils/misc.utils';

type ManualAdjustmentDialogProps = {
  show: boolean;
  loading: boolean;
  offsetManualAdjustment?: number;
  handleSubmit: (offsetTime: number) => void;
  handleReset: () => void;
  handleClose: () => void;
};

const ManualAdjustmentDialog = ({
  show,
  offsetManualAdjustment,
  handleClose,
  handleSubmit,
  handleReset,
}: ManualAdjustmentDialogProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [timeValue, setTimeValue] = useState<moment.Moment | null>(null);

  const handleAdd = () => {
    const timeToAdd = -getMillisecondsFromMoment(timeValue);
    handleSubmit(timeToAdd);

    handleClose();
  };

  const handleSubtract = () => {
    const timeToSubtract = -getMillisecondsFromMoment(timeValue);
    handleSubmit(timeToSubtract);

    handleClose();
  };

  const formattedOffset = useMemo(() => {
    if (!offsetManualAdjustment) return '00:00:00';
    // This plugin shows more than 24h
    return moment.duration(-offsetManualAdjustment).format('HH:mm:ss', {
      trim: false,
    });
  }, [offsetManualAdjustment]);

  return (
    <Dialog open={show} onClose={handleClose} maxWidth={'xs'} fullWidth>
      <DialogTitle>{t('title.manual_adjustment_dialog_title')}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TimePicker
              value={timeValue}
              onChange={(newValue) => setTimeValue(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              ampm={false}
              inputFormat="HH:mm:ss"
              mask="__:__:__"
              views={['hours', 'minutes', 'seconds']}
              label={t('label.adjust_manual_offset')}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <TextField
              value={formattedOffset}
              disabled
              label={t('label.total_manual_offset')}
              fullWidth
            />
          </FormControl>
          <Box width={1} mb={1}>
            <Typography variant="body2">{t('helper_text.total_manual_offset')}</Typography>
          </Box>
        </LocalizationProvider>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={handleClose}>{t('action.cancel')}</Button>
        <Button
          onClick={() => {
            handleClose();
            handleReset();
          }}
        >
          {t('action.reset')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          endIcon={<RemoveIcon />}
          onClick={handleSubtract}
        >
          {t('action.subtract')}
        </Button>
        <Button variant="contained" color="primary" endIcon={<AddIcon />} onClick={handleAdd}>
          {t('action.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(ManualAdjustmentDialog);
