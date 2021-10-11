import { IStepDescriptor } from '../interfaces/step-descriptor.interface';

export function getToolbarSteps(): IStepDescriptor[] {
  return [
    {
      key: 'initial_step',
    },
    {
      key: 'net_worth_step',
      selector: '[data-tour-elem="netWorthView"]',
    },
    {
      key: 'bulk_sell_step',
      selector: '[data-tour-elem="bulkSellView"]',
    },
    {
      key: 'settings_step',
      selector: '[data-tour-elem="settingsView"]',
    },
    {
      key: 'profile_step',
      selector: '[data-tour-elem="profileArea"]',
    },
    {
      key: 'snapshot_step',
      selector: '[data-tour-elem="snapshotArea"]',
    },
    {
      key: 'overlay_step',
      selector: '[data-tour-elem="overlayArea"]',
    },
    {
      key: 'group_step',
      selector: '[data-tour-elem="groupArea"]',
    },
    {
      key: 'notifications_step',
      selector: '[data-tour-elem="notificationList"]',
    },
    {
      key: 'currency_switch',
      selector: '[data-tour-elem="currencySwitch"]',
    },
    {
      key: 'reset_income',
      selector: '[data-tour-elem="resetIncome"]',
    },
    {
      key: 'support_panel_step',
      selector: '[data-tour-elem="supportPanel"]',
    },
  ];
}
