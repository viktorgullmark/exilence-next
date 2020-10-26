import { inject, observer } from 'mobx-react';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { AccountStore } from '../../../store/accountStore';
import { LeagueStore } from '../../../store/leagueStore';
import { UiStateStore } from '../../../store/uiStateStore';
import PriceTableLeagueDropdown from './PriceTableLeagueDropdown';

type PriceTableLeagueDropdownContainerProps = {
  uiStateStore?: UiStateStore;
  leagueStore?: LeagueStore;
  accountStore?: AccountStore;
};

export type PriceTableFilterForm = {
  priceLeague: string;
};

const PriceTableLeagueDropdownContainer = ({
  uiStateStore,
  leagueStore,
  accountStore,
}: PriceTableLeagueDropdownContainerProps) => {
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

export default inject(
  'uiStateStore',
  'leagueStore',
  'accountStore'
)(observer(PriceTableLeagueDropdownContainer));
