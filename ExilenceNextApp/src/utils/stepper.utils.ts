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
      key: 'networth_session_step',
      selector: '[data-tour-elem="networthSessionArea"]',
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

export function getNetworthSessionToolbarSteps(): IStepDescriptor[] {
  return [
    {
      key: 'motivation',
    },
    {
      key: 'initial_step',
    },
    {
      key: 'income_switch',
      selector: '[data-tour-elem="incomeSwitch"]',
    },
    {
      key: 'session_duration_step',
      selector: '[data-tour-elem="sessionDuration"]',
    },
    {
      key: 'session_started_at_step',
      selector: '[data-tour-elem="sessionStartedAt"]',
    },
    {
      key: 'session_duration_history_chart_step',
      selector: '[data-tour-elem="sessionDurationHistoryChart"]',
    },
    {
      key: 'session_duration_history_pie_chart_step',
      selector: '[data-tour-elem="sessionDurationHistoryPieChart"]',
    },
    {
      key: 'manual_adjustment_step',
      selector: '[data-tour-elem="manualAdjustment"]',
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
  ];
}
