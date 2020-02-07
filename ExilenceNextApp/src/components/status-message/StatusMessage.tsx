import { observer } from 'mobx-react';
import React from 'react';
import { IStatusMessage } from '../../interfaces/status-message.interface';
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface Props {
  statusMessage?: IStatusMessage;
}

const StatusMessage: React.FC<Props> = ({ statusMessage }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      {statusMessage && (
        <Typography variant="body2">
          {t(`status:message.${statusMessage.message}`, { param: statusMessage?.translateParam })} ...
        </Typography>
      )}
    </>
  );
};

export default observer(StatusMessage);
