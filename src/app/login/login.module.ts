import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatStepperModule, MatButtonModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from '../shared/shared.module';
import { StepperComponent } from './components/stepper/stepper.component';
import { LoginPageComponent } from './containers/login-page/login-page.component';

@NgModule({
  declarations: [LoginPageComponent, StepperComponent],
  exports: [LoginPageComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    BrowserAnimationsModule
  ]
})
export class LoginModule { }
