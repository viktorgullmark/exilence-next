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
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Snapshot } from '../../store/domains/snapshot';
import { calculateNetWorth, mapSnapshotToApiSnapshot } from '../../utils/snapshot.utils';
import useStyles from './RemoveSnapshotsDialog.styles';
import WarningIcon from '@mui/icons-material/Warning';

type RemoveSnapshotsDialogProps = {
  show: boolean;
  loading: boolean;
  snapshots: Snapshot[];
  sessionSnapshots: Snapshot[];
  handleSubmit: (snapshotIds: string[]) => void;
  onClose: () => void;
};

type CombinedSnapshots = [Snapshot, Snapshot | undefined];
type ComboCombinedSnapshots = [Snapshot | undefined, Snapshot | undefined];

const RemoveSnapshotsDialog = ({
  show,
  onClose,
  loading,
  snapshots,
  sessionSnapshots,
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

  const combinedSnapshotsSorted = useMemo(() => {
    const combinedSnapshots = snapshots.map((snapshot) => [
      snapshot,
      sessionSnapshots.find((ss) => ss.uuid === snapshot.uuid),
    ]) as CombinedSnapshots[];

    let diffSessionSnapshots = sessionSnapshots.filter(
      (sessionSnapshot) => !snapshots.some((s) => s.uuid === sessionSnapshot.uuid)
    );

    const combinedSnapshotsSorted: ComboCombinedSnapshots[] = [];
    combinedSnapshots.forEach((s) => {
      diffSessionSnapshots = diffSessionSnapshots.filter((ss) => {
        const isBefore = moment(ss.created).isAfter(moment(s[0].created));
        if (isBefore) {
          combinedSnapshotsSorted.push([undefined, ss]);
        }
        return !isBefore;
      });
      combinedSnapshotsSorted.push(s);
    });

    diffSessionSnapshots.forEach((ss) => {
      combinedSnapshotsSorted.push([undefined, ss]);
    });

    return combinedSnapshotsSorted;
  }, [snapshots, sessionSnapshots]);

  return (
    <Dialog open={show} onClose={onClose} maxWidth={'md'} fullWidth>
      <DialogTitle>{t('title.remove_snapshots_dialog_title')}</DialogTitle>
      <DialogContent>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {combinedSnapshotsSorted.map((comboSnapshot) => {
            // Its kind of zipmap
            const snapshot = comboSnapshot[0];
            const sessionSnapshot = comboSnapshot[1];

            const primarySnapshot = snapshot;
            const secondarySnapshot = sessionSnapshot;

            const primaryLabelId = primarySnapshot
              ? `checkbox-list-label-${primarySnapshot.uuid}`
              : '';
            const secondaryLabelId = secondarySnapshot
              ? `checkbox-list-label-${secondarySnapshot.uuid}`
              : '';

            const primarySnapshotItems =
              primarySnapshot?.stashTabSnapshots.flatMap((x) => x.pricedItems) || [];
            const secondarySnapshotItems =
              secondarySnapshot?.stashTabSnapshots.flatMap((x) => x.pricedItems) || [];

            return (
              <ListItem key={primarySnapshot?.uuid || secondarySnapshot?.uuid} disablePadding>
                {primarySnapshot ? (
                  <ListItemButton
                    className={classes.listItem}
                    role={undefined}
                    onClick={handleToggle(primarySnapshot.uuid)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(primarySnapshot.uuid) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': primaryLabelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={primaryLabelId}
                      primary={`Snapshot ${moment(primarySnapshot.created).format(
                        'YYYY-MM-DD HH:mm'
                      )}, value: ${calculateNetWorth([
                        mapSnapshotToApiSnapshot(primarySnapshot),
                      ]).toFixed(2)}c`}
                    />
                    {primarySnapshotItems.length === 0 && (
                      <ListItemIcon>
                        <Tooltip title={t('label.items_missing') || ''} placement="bottom">
                          <WarningIcon className={classes.warningIcon} />
                        </Tooltip>
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                ) : (
                  <div className={classes.emptyItem} />
                )}
                {secondarySnapshot && (
                  <ListItemButton
                    key={`_ss_${secondarySnapshot.uuid}`}
                    role={undefined}
                    onClick={handleToggle(`_ss_${secondarySnapshot.uuid}`)}
                    dense
                  >
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={checked.indexOf(`_ss_${secondarySnapshot.uuid}`) !== -1}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': secondaryLabelId }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      id={secondaryLabelId}
                      primary={`Session value: ${calculateNetWorth([
                        mapSnapshotToApiSnapshot(secondarySnapshot),
                      ]).toFixed(2)}c`}
                    />
                    {secondarySnapshotItems.length === 0 && (
                      <ListItemIcon>
                        <Tooltip title={t('label.items_missing') || ''} placement="bottom">
                          <WarningIcon className={classes.warningIcon} />
                        </Tooltip>
                      </ListItemIcon>
                    )}
                  </ListItemButton>
                )}
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={() => {
            setChecked((checked) => checked.concat(snapshots.map((s) => s.uuid)));
          }}
        >
          {t('action.select_all_snapshots')}
        </Button>
        <Button
          onClick={() => {
            setChecked((checked) => checked.concat(sessionSnapshots.map((ss) => `_ss_${ss.uuid}`)));
          }}
        >
          {t('action.select_all_session_snapshots')}
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
