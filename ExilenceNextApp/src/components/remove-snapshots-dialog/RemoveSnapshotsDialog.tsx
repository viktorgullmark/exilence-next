import RemoveIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snapshot } from '../../store/domains/snapshot';
import { calculateNetWorth, mapSnapshotToApiSnapshot } from '../../utils/snapshot.utils';
import useStyles from './RemoveSnapshotsDialog.styles';
import WarningIcon from '@mui/icons-material/Warning';

type RemoveSnapshotsDialogProps = {
  show: boolean;
  loading: boolean;
  snapshots: Snapshot[];
  handleSubmit: (snapshotIds: string[]) => void;
  onClose: () => void;
};

const RemoveSnapshotsDialog = ({
  show,
  onClose,
  loading,
  snapshots,
  handleSubmit,
}: RemoveSnapshotsDialogProps) => {
  const [checked, setChecked] = useState<string[]>([]);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setChecked([]);
    }, 250);
  };

  const classes = useStyles();
  const { t } = useTranslation();

  const handleToggle = (uuid: string) => () => {
    const currentIndex = checked.indexOf(uuid);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(uuid);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth={'sm'} fullWidth>
      <DialogTitle>{t('title.remove_snapshots_dialog_title')}</DialogTitle>
      <DialogContent>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {snapshots.map((s) => {
            const labelId = `checkbox-list-label-${s.uuid}`;
            const snapshotItems = s.stashTabSnapshots.flatMap((x) => x.pricedItems);
            return (
              <ListItem
                key={s.uuid}
                disablePadding
                secondaryAction={
                  snapshotItems.length === 0 && (
                    <Tooltip title={t('label.items_missing') || ''} placement="bottom">
                      <WarningIcon className={classes.warningIcon} />
                    </Tooltip>
                  )
                }
              >
                <ListItemButton role={undefined} onClick={handleToggle(s.uuid)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(s.uuid) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={`Snapshot ${moment(s.created).format(
                      'YYYY-MM-DD HH:MM'
                    )}, value: ${calculateNetWorth([mapSnapshotToApiSnapshot(s)]).toFixed(2)}c`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button onClick={() => setChecked(snapshots.map((s) => s.uuid))}>
          {t('action.select_all')}
        </Button>
        <Button onClick={handleClose}>{t('action.cancel')}</Button>
        <LoadingButton
          variant="contained"
          type="submit"
          color="primary"
          loadingPosition="end"
          loading={loading}
          onClick={() => handleSubmit(checked)}
          endIcon={<RemoveIcon />}
          disabled={checked.length === 0}
        >
          {t('action.remove_snapshots')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default observer(RemoveSnapshotsDialog);
