import { inject, observer } from 'mobx-react';
import React from 'react';
import { AccountStore } from '../../store/accountStore';
import { CustomPriceStore } from '../../store/customPriceStore';
import { UiStateStore } from '../../store/uiStateStore';
import CustomPriceDialog, { CustomPriceForm } from './CustomPriceDialog';

type CustomPriceDialogContainerProps = {
  uiStateStore?: UiStateStore;
  customPriceStore?: CustomPriceStore;
  accountStore?: AccountStore;
};

const CustomPriceDialogContainer = ({
  uiStateStore,
  customPriceStore,
  accountStore,
}: CustomPriceDialogContainerProps) => {
  const initialValues: CustomPriceForm = {
    price: uiStateStore!.selectedPricedItem?.calculated || 0,
  };

  const onSubmit = (form: CustomPriceForm) => {
    const price = uiStateStore!.selectedPricedItem;
    // todo: replace with dd value
    const activeLeagueId = accountStore?.getSelectedAccount.activeProfile?.activePriceLeagueId;
    if (price && activeLeagueId) {
      customPriceStore!.addOrUpdateCustomPrice(
        {
          customPrice: form.price,
          name: price.name,
          icon: price.icon,
          quality: price.quality,
          links: price.links,
          level: price.level,
          corrupted: price.corrupted,
          frameType: price.frameType,
          variant: price.variant,
          elder: price.elder,
          shaper: price.shaper,
          ilvl: price.ilvl,
          tier: price.tier,
          count: 1,
        },
        activeLeagueId
      );
      uiStateStore!.setCustomPriceDialogOpen(false);
    }
  };

  return (
    <CustomPriceDialog
      show={uiStateStore!.customPriceDialogOpen}
      initialValues={initialValues}
      onClose={() => uiStateStore!.setCustomPriceDialogOpen(false)}
      onSubmit={(form: CustomPriceForm) => onSubmit(form)}
    />
  );
};

export default inject(
  'uiStateStore',
  'customPriceStore',
  'accountStore'
)(observer(CustomPriceDialogContainer));