import { Box, Typography } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { openLink } from '../../utils/window.utils';
import ItemTableContainer from '../item-table/ItemTableContainer';
import TabPanel from './../tab-panel/TabPanel';
import useStyles from './NetWorthTabGroup.styles';

export const netWorthTabGroupHeight = 48;

function a11yProps(index: any) {
  return {
    id: `net-worth-tab-${index}`,
    'aria-controls': `net-worth-tabpanel-${index}`
  };
}

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
