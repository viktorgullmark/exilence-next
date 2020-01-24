import { Box, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountStore } from '../../store/accountStore';
import { SignalrStore } from '../../store/signalrStore';
import SnapshotHistoryChart from './SnapshotHistoryChart';

interface Props {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore,
  signalrStore
}: Props) => {
  const { t } = useTranslation();

  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const chartData = () => {
    return activeProfile ? activeProfile.chartData : [];
  };

  const getChartLength = () => {
    return activeGroup ? activeGroup.chartData.length : chartData().length;
  };

  const { activeGroup } = signalrStore!;

  return (
    <>
      {getChartLength() >= 10 ? (
        <SnapshotHistoryChart
          chartData={activeGroup ? activeGroup.chartData : chartData()}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          p={2}
        >
          <Typography variant="subtitle2" align="center">
            {t('label.snapshot_length_requirement_text')}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default inject(
  'accountStore',
  'signalrStore'
)(observer(SnapshotHistoryChartContainer));
