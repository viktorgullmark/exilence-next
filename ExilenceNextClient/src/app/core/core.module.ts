import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule,
  MatBottomSheetModule,
} from '@angular/material';
import { NgPipesModule } from 'ngx-pipes';

import { SharedModule } from '../shared/shared.module';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import {
  SnapshotProgressSnackbarSnackComponent,
} from './components/snapshot-progress-snackbar/snapshot-progress-snackbar-snack/snapshot-progress-snackbar-snack.component';
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
import { SettingsBottomSheetPageComponent } from './containers/settings-bottom-sheet-page/settings-bottom-sheet-page.component';
import { SettingsBottomSheetContentComponent } from './components/settings-bottom-sheet-content/settings-bottom-sheet-content.component';


@NgModule({
  imports: [SharedModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule,
    NgPipesModule,
    MatProgressBarModule
  ],
  declarations: [HeaderPageComponent, SettingsBottomSheetPageComponent, SettingsBottomSheetContentComponent,
    NotificationSidebarPageComponent, NotificationListComponent,
    SnapshotProgressSnackbarComponent, SnapshotProgressSnackbarSnackComponent],
  exports: [HeaderPageComponent, SettingsBottomSheetPageComponent, SettingsBottomSheetContentComponent,
    NotificationSidebarPageComponent, NotificationListComponent,
    SnapshotProgressSnackbarComponent, SnapshotProgressSnackbarSnackComponent],
  providers: [CookieService, SessionService, ExternalService, JsonService],
  entryComponents: [SnapshotProgressSnackbarSnackComponent, SettingsBottomSheetContentComponent]
})

export class CoreModule { }
