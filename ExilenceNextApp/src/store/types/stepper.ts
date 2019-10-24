import { observable, computed, action } from 'mobx';

import { IStepper } from './../../interfaces/stepper.interface';

export class Stepper implements IStepper {
  @observable activeStep: number = 0;

  constructor(obj?: IStepper) {
    Object.assign(this, obj);
  }

  @action
  setActiveStep(index: number) {
    this.activeStep = index;
  }
}
