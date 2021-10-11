import React from 'react';
import { useTranslation } from 'react-i18next';
import { Stack, Tooltip, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import InfoIcon from '@mui/icons-material/Info';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import useStyles from './StatusMessage.styles';

type StatusMessageProps = {
  statusMessage?: IStatusMessage;
  infoLabel?: string;
  isSnapshotting?: boolean;
};

const StatusMessage = ({ statusMessage, infoLabel, isSnapshotting }: StatusMessageProps) => {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <>
      {statusMessage && (
        <Stack spacing={1} direction="row" alignItems="center">
          <Typography variant="body2">
            {t(`status:message.${statusMessage.message}`, { param: statusMessage?.translateParam })}{' '}
            {statusMessage.currentCount && statusMessage.totalCount && (
              <>
                {statusMessage.currentCount} / {statusMessage.totalCount}
              </>
            )}{' '}
            ...
          </Typography>
          {infoLabel && isSnapshotting && (
            <Tooltip title={infoLabel || ''} placement="bottom">
              <InfoIcon classes={{ root: classes.iconRoot }} />
            </Tooltip>
          )}
        </Stack>
      )}
    </>
  );
};

export default observer(StatusMessage);
