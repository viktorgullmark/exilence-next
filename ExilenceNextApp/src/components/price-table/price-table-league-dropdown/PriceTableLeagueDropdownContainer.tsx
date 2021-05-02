import { observer } from 'mobx-react-lite';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { useStores } from '../../..';
import PriceTableLeagueDropdown from './PriceTableLeagueDropdown';

export type PriceTableFilterForm = {
  priceLeague: string;
};

const PriceTableLeagueDropdownContainer = () => {
  const { uiStateStore, leagueStore, accountStore } = useStores();
  const { t } = useTranslation();

  const validationSchema = Yup.object<PriceTableFilterForm>().shape({
    priceLeague: Yup.number().required(t('label.required')),
  });

  const leagueId = uiStateStore!.selectedPriceTableLeagueId;
  const activeLeagueId = accountStore!.getSelectedAccount.activePriceLeague?.id;

  useEffect(() => {
    if (!leagueId) {
      uiStateStore!.setSelectedPriceTableLeagueId(activeLeagueId || '');
    }
  }, []);

  const initialValues: PriceTableFilterForm = useMemo(() => {
    return { priceLeague: leagueId || '' };
  }, [leagueId]);

  const onSubmit = (form: PriceTableFilterForm) => {
    uiStateStore!.setSelectedPriceTableLeagueId(form.priceLeague);
  };

  return (
    <PriceTableLeagueDropdown
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      priceLeagues={leagueStore!.priceLeagues}
    />
  );
};

export default observer(PriceTableLeagueDropdownContainer);
