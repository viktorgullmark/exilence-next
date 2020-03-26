import { observer, inject } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { UiStateStore } from '../../../store/uiStateStore';
import useStyles from './ItemTableFilterSection.styles';
import {
  Box,
  Grid,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button
} from '@material-ui/core';
import StashTabDropdown from '../../stash-tab-dropdown/StashTabDropdown';
import { IStashTab } from '../../../interfaces/stash.interface';
import { AccountStore } from '../../../store/accountStore';

export interface IProps {
  uiStateStore?: UiStateStore;
  accountStore?: AccountStore;
}

const ItemTableFilterSection: React.FC<IProps> = ({
  uiStateStore,
  accountStore
}: IProps) => {
  const [selectedStashTabs, setSelectedStashTabs] = useState<IStashTab[]>([]);
  const [stashTabs, setStashTabs] = useState<IStashTab[]>([]);

  const account = accountStore!.getSelectedAccount;
  const { accountLeagues, activeProfile } = account;

  useEffect(() => {
    setStashTabs([]);
    setSelectedStashTabs([]);
    if (activeProfile) {
      const foundLeague = accountLeagues.find(
        al => al.leagueId === activeProfile.activeLeagueId
      );
      if (foundLeague) {
        setStashTabs(
          foundLeague.stashtabs.filter(st =>
            activeProfile.activeStashTabIds.includes(st.id)
          )
        );
        setSelectedStashTabs(
          foundLeague.stashtabs.filter(st =>
            activeProfile.activeStashTabIds.includes(st.id)
          )
        );
        uiStateStore!.setFilteredStashTabs(
          foundLeague.stashtabs.filter(st =>
            activeProfile.activeStashTabIds.includes(st.id)
          )
        );
      }
    }
  }, [activeProfile]);

  const { t } = useTranslation();

  const handleStashTabChange = (value: IStashTab[]) => {
    setSelectedStashTabs(value);
    uiStateStore!.setFilteredStashTabs(value);
  };

  return (
    <Box mb={1}>
      <Box>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            {stashTabs.length > 0 && (
              <StashTabDropdown
                width={400}
                size="small"
                stashTabs={stashTabs}
                selectedStashTabs={selectedStashTabs}
                handleStashTabChange={handleStashTabChange}
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
};

export default inject(
  'uiStateStore',
  'accountStore'
)(observer(ItemTableFilterSection));
