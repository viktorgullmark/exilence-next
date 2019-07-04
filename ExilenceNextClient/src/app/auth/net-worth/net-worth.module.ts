import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../shared/shared.module';
import { NetWorthBarComponent } from './components/net-worth-bar/net-worth-bar.component';
import { NetWorthGraphComponent } from './components/net-worth-graph/net-worth-graph.component';
import { NetWorthItemTableComponent } from './components/net-worth-item-table/net-worth-item-table.component';
import { NetWorthToolbarComponent } from './components/net-worth-toolbar/net-worth-toolbar.component';
import { NetWorthPageComponent } from './containers/net-worth-page/net-worth-page.component';
import { NetWorthRoutingModule } from './net-worth-routing.module';
import { SnapshotService } from './providers/snapshot.service';
import { EffectsModule } from '@ngrx/effects';
import { NetWorthEffects } from '../../store/net-worth/net-worth.effects';
import { StoreModule } from '@ngrx/store';
import { reducer } from '../../store/net-worth/net-worth.reducer';
import { PoeNinjaService } from './providers/poe-ninja.service';
import { PoeWatchService } from './providers/poe-watch.service';
import { ItemPricingService } from './providers/item-pricing.service';
@NgModule({
  declarations: [NetWorthPageComponent, NetWorthBarComponent, NetWorthToolbarComponent, NetWorthGraphComponent, NetWorthItemTableComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatSelectModule,
    NgxChartsModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDatepickerModule,
    NetWorthRoutingModule,
    StoreModule.forFeature('netWorthState', reducer),
    EffectsModule.forFeature([
      NetWorthEffects
    ])
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    SnapshotService, ItemPricingService, PoeNinjaService, PoeWatchService
  ]
})
export class NetWorthModule { }
