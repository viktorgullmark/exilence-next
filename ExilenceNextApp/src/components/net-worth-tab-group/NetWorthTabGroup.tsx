import { Box, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { primaryLighter } from '../../assets/themes/exilence-theme';
import { openLink } from '../../utils/window.utils';
import ItemTableContainer from '../item-table/ItemTableContainer';
import TabPanel from './../tab-panel/TabPanel';
import SnapshotHistoryChartContainer from '../snapshot-history-chart/SnapshotHistoryChartContainer';

function a11yProps(index: any) {
  return {
    id: `net-worth-tab-${index}`,
    'aria-controls': `net-worth-tabpanel-${index}`
  };
}

export const netWorthTabGroupHeight = 48;

const useStyles = makeStyles((theme: Theme) => ({
  tabHeader: {
    height: netWorthTabGroupHeight,
    background: theme.palette.secondary.main
  },
  poeNinjaCredit: {
    height: netWorthTabGroupHeight,
    right: theme.spacing(2),
    color: theme.palette.text.primary
  },
  creditText: {
    fontSize: '0.85rem'
  },
  inlineLink: {
    color: primaryLighter,
    verticalAlign: 'baseline',
    textDecoration: 'none'
  },
  indicator: {
    backgroundColor: theme.palette.primary.light
  },
  tab: {
    // color: theme.palette.primary.light
  }
}));

const NetWorthTabGroup: React.FC = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <AppBar position="static" className={classes.tabHeader}>
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{ indicator: classes.indicator }}
        >
          <Tab
            label={t('label.item_table')}
            className={classes.tab}
            {...a11yProps(0)}
          />
        </Tabs>
        <Box
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
          className={classes.poeNinjaCredit}
        >
          <Typography className={classes.creditText}>
            {t('label.prices_fetched_from')}
            <a
              className={classes.inlineLink}
              href="https://poe.ninja"
              onClick={e => openLink(e)}
            >
              https://poe.ninja
            </a>
          </Typography>
        </Box>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ItemTableContainer />
      </TabPanel>
    </>
  );
};

export default NetWorthTabGroup;
