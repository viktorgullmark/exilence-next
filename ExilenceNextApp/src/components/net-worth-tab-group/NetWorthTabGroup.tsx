import AppBar from '@material-ui/core/AppBar';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import React from 'react';
import TabPanel from './../tab-panel/TabPanel';
import { useTranslation } from 'react-i18next';
import ItemTableContainer from '../item-table/ItemTableContainer';

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export const netWorthTabGroupHeight = 48;

const useStyles = makeStyles((theme: Theme) => ({
  tabHeader: {
    height: netWorthTabGroupHeight,
    background: theme.palette.primary.dark
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
          aria-label="simple tabs example"
        >
          <Tab label={t('label.item_table')} {...a11yProps(0)} />
          <Tab disabled label={t('label.graphs')} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <ItemTableContainer />
      </TabPanel>
      <TabPanel value={value} index={1}></TabPanel>
    </>
  );
};

export default NetWorthTabGroup;
