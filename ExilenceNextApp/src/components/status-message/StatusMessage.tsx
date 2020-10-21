import React from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '@material-ui/core';
import { observer } from 'mobx-react';

import { IStatusMessage } from '../../interfaces/status-message.interface';

type StatusMessageProps = {
  statusMessage?: IStatusMessage;
};

const StatusMessage = ({ statusMessage }: StatusMessageProps) => {
  const { t } = useTranslation();

  return (
    <>
      {statusMessage && (
        <Typography variant="body2">
          {t(`status:message.${statusMessage.message}`, { param: statusMessage?.translateParam })}{' '}
          {statusMessage.currentCount && statusMessage.totalCount && (
            <>
              {statusMessage.currentCount} / {statusMessage.totalCount}
            </>
          )}{' '}
          ...
        </Typography>
      )}
    </>
  );
};

export default observer(StatusMessage);
