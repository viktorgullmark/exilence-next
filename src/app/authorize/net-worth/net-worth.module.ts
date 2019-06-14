import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { NetWorthComponent } from './net-worth.component';
import { MatTabsModule, MatIconModule } from '@angular/material';

@NgModule({
  declarations: [NetWorthComponent],
  imports: [
    SharedModule,
    MatTabsModule,
    MatIconModule
  ]
})
export class NetWorthModule { }
