import { IStepDescriptor } from '../interfaces/step-descriptor.interface';

export function getToolbarSteps(): IStepDescriptor[] {
  return [
    {
      key: 'initial_step'
    },
    {
      key: 'profile_step',
      selector: '[data-tour-elem="profileArea"]'
    },
    {
      key: 'snapshot_step',
      selector: '[data-tour-elem="snapshotArea"]'
    },
    {
      key: 'overlay_step',
      selector: '[data-tour-elem="overlayArea"]'
    },
    {
      key: 'group_step',
      selector: '[data-tour-elem="groupArea"]'
    },
    {
      key: 'notifications_step',
      selector: '[data-tour-elem="notificationList"]'
    }
  ];
}
