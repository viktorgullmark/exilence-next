import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatExpansionModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSidenavModule,
  MatToolbarModule,
  MatProgressBarModule
} from '@angular/material';
import { NgPipesModule } from 'ngx-pipes';
import { SharedModule } from '../shared/shared.module';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { HeaderPageComponent } from './containers/header-page/header-page.component';
import { NotificationSidebarPageComponent } from './containers/notification-sidebar-page/notification-sidebar-page.component';
import { CookieService } from './providers/cookie.service';
import { ExternalService } from './providers/external.service';
import { JsonService } from './providers/json.service';
import { SessionService } from './providers/session.service';
import { ProgressSnackbarComponent } from './components/progress-snackbar/progress-snackbar.component';
import { ProgressSnackbarSnackComponent } from './components/progress-snackbar/progress-snackbar-snack/progress-snackbar-snack.component';


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
    ProgressSnackbarComponent, ProgressSnackbarSnackComponent],
  exports: [HeaderPageComponent, NotificationSidebarPageComponent, NotificationListComponent,
    ProgressSnackbarComponent, ProgressSnackbarSnackComponent],
  providers: [CookieService, SessionService, ExternalService, JsonService],
  entryComponents: [ProgressSnackbarSnackComponent]
})

export class CoreModule { }
