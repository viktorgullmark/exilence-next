import { Box, Divider, Grid } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useStores } from '../../..';
import { IStashTab } from '../../../interfaces/stash.interface';
import StashTabDropdown from '../../stash-tab-dropdown/StashTabDropdown';

const ItemTableFilterSection = () => {
  const { uiStateStore, accountStore } = useStores();
  const [selectedStashTabs, setSelectedStashTabs] = useState<IStashTab[]>([]);
  const [stashTabs, setStashTabs] = useState<IStashTab[]>([]);

  const account = accountStore!.getSelectedAccount;
  const { accountLeagues, activeProfile } = account;

  useEffect(() => {
    setStashTabs([]);
    setSelectedStashTabs([]);
    if (activeProfile) {
      const foundLeague = accountLeagues.find((al) => al.leagueId === activeProfile.activeLeagueId);
      if (foundLeague) {
        setStashTabs(
          foundLeague.stashtabList.filter((st) => activeProfile.activeStashTabIds.includes(st.id))
        );
        setSelectedStashTabs(
          foundLeague.stashtabList.filter((st) => activeProfile.activeStashTabIds.includes(st.id))
        );
        uiStateStore!.setFilteredStashTabs(
          foundLeague.stashtabList.filter((st) => activeProfile.activeStashTabIds.includes(st.id))
        );
      }
    }
  }, [activeProfile, activeProfile?.activeStashTabIds]);

  const handleStashTabChange = (_e: ChangeEvent<{}>, value: IStashTab[]) => {
    setSelectedStashTabs(value);
    uiStateStore!.setFilteredStashTabs(value);
  };

  return (
    <>
      {stashTabs.length > 0 && (
        <Box mb={1}>
          <Box>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>
                <StashTabDropdown
                  width={500}
                  size="small"
                  marginBottom={1.5}
                  stashTabs={stashTabs}
                  selectedStashTabs={selectedStashTabs}
                  handleStashTabChange={handleStashTabChange}
                />
              </Grid>
            </Grid>
          </Box>
          <Divider />
        </Box>
      )}
    </>
  );
};

export default observer(ItemTableFilterSection);
