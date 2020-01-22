import { inject, observer } from 'mobx-react';
import React, { useRef } from 'react';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import SnapshotHistoryChart from './SnapshotHistoryChart';
import { SignalrStore } from '../../store/signalrStore';
import { Box, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useSize from '../../hooks/use-size';
import { useWindowSize } from '../../hooks/use-window-size';
import useComponentSize from '@rehooks/component-size'

interface Props {
  accountStore?: AccountStore;
  signalrStore?: SignalrStore;
  uiStateStore?: UiStateStore;
}

const SnapshotHistoryChartContainer: React.FC<Props> = ({
  accountStore,
  signalrStore,
  uiStateStore
}: Props) => {
  const { t } = useTranslation();
  let parentRef = useRef(null)
  let size = useComponentSize(parentRef)
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;

  const chartData = () => {
    return activeProfile ? activeProfile.chartData : [];
  };

  const { activeGroup } = signalrStore!;

  return (
    <div ref={parentRef} style={{ height: '100%', width: '100%' }} >
      <div style={{ height: '100%', width: '100%' }}>
        {(activeGroup ? activeGroup.chartData.length : chartData().length > 20) ? (
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
    </div>
  );
};

export default inject(
  'accountStore',
  'signalrStore',
  'uiStateStore'
)(observer(SnapshotHistoryChartContainer));
