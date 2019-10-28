import { action, observable } from 'mobx';

import { IStepper } from '../../interfaces/stepper.interface';

export class Stepper implements IStepper {
  @observable activeStep: number = 0;
  @observable isSubmitting: boolean = false;

  constructor(obj?: IStepper) {
    Object.assign(this, obj);
  }

  @action
  setActiveStep(index: number) {
    this.activeStep = index;
  }

  @action
  setSubmitting(submitting: boolean) {
    this.isSubmitting = submitting;
  }
}
