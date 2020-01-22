import { Box, Typography } from '@material-ui/core';
import useComponentSize from '@rehooks/component-size';
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
  let parentRef = useRef(null);
  let size = useComponentSize(parentRef);
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const chartData = () => {
    return activeProfile ? activeProfile.chartData : [];
  };

  const getChartLength = () => {
    return activeGroup ? activeGroup.chartData.length : chartData().length;
  };

  const { activeGroup } = signalrStore!;

  return (
    <div ref={parentRef} style={{ height: '100%', width: '100%' }}>
      {getChartLength() > 20 ? (
        <SnapshotHistoryChart
          width={size.width}
          height={size.height}
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
    </div>
  );
};

export default inject(
  'accountStore',
  'signalrStore'
)(observer(SnapshotHistoryChartContainer));
