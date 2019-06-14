import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { NetWorthComponent } from './net-worth.component';
import { MatTabsModule, MatIconModule } from '@angular/material';
import { NetWorthBarComponent } from './components/net-worth-bar/net-worth-bar.component';

@NgModule({
  declarations: [NetWorthComponent, NetWorthBarComponent],
  imports: [
    SharedModule,
    MatTabsModule,
    MatIconModule
  ]
})
export class NetWorthModule { }
