import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';
import { NgPipesModule } from 'ngx-pipes';

import { SharedModule } from '../shared/shared.module';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import {
  SnapshotProgressSnackbarComponent,
} from './components/snapshot-progress-snackbar/snapshot-progress-snackbar.component';
import { HeaderPageComponent } from './containers/header-page/header-page.component';
import {
  NotificationSidebarPageComponent,
} from './containers/notification-sidebar-page/notification-sidebar-page.component';
import { CookieService } from './providers/cookie.service';
import { ExternalService } from './providers/external.service';
import { JsonService } from './providers/json.service';
import { SessionService } from './providers/session.service';
import { SnapshotProgressSnackbarSnackComponent } from
  './components/snapshot-progress-snackbar/snapshot-progress-snackbar-snack/snapshot-progress-snackbar-snack.component';


@NgModule({
  imports: [SharedModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    NgPipesModule,
    MatProgressBarModule
  ],
  declarations: [HeaderPageComponent, NotificationSidebarPageComponent, NotificationListComponent,
    SnapshotProgressSnackbarComponent, SnapshotProgressSnackbarSnackComponent],
  exports: [HeaderPageComponent, NotificationSidebarPageComponent, NotificationListComponent,
    SnapshotProgressSnackbarComponent, SnapshotProgressSnackbarSnackComponent],
  providers: [CookieService, SessionService, ExternalService, JsonService],
  entryComponents: [SnapshotProgressSnackbarSnackComponent]
})

export class CoreModule { }
