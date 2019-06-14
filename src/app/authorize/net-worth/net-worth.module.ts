import { NgModule } from '@angular/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SharedModule } from '../../shared/shared.module';
import { NetWorthComponent } from './net-worth.component';
import {
  MatTabsModule, MatIconModule, MatInputModule, MatDatepickerModule, MatFormFieldModule, DateAdapter,
  MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatSelectModule
} from '@angular/material';
import { NetWorthBarComponent } from './components/net-worth-bar/net-worth-bar.component';
import { NetWorthToolbarComponent } from './components/net-worth-toolbar/net-worth-toolbar.component';
import { NetWorthGraphComponent } from './components/net-worth-graph/net-worth-graph.component';
import { NetWorthItemTableComponent } from './components/net-worth-item-table/net-worth-item-table.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NetWorthComponent, NetWorthBarComponent, NetWorthToolbarComponent, NetWorthGraphComponent, NetWorthItemTableComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ]
})
export class NetWorthModule { }
