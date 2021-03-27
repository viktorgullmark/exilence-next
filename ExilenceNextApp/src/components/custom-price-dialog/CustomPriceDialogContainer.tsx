import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from '../..';
import CustomPriceDialog, { CustomPriceForm } from './CustomPriceDialog';

const CustomPriceDialogContainer = () => {
  const { uiStateStore, customPriceStore } = useStores();
  const value = uiStateStore!.selectedPricedItem?.calculated || 0;
  const initialValues: CustomPriceForm = {
    price: +value.toFixed(2),
  };

  const onSubmit = (form: CustomPriceForm) => {
    const price = uiStateStore!.selectedPricedItem;
    const activeLeagueId = uiStateStore!.selectedPriceTableLeagueId;
    if (price && activeLeagueId) {
      customPriceStore!.addOrUpdateCustomPrice(
        {
          calculated: price.calculated,
          customPrice: +form.price,
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

export default observer(CustomPriceDialogContainer);
