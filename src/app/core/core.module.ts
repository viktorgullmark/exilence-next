import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSidenavModule,
  MatToolbarModule,
} from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationSidebarComponent } from './components/notification-sidebar/notification-sidebar.component';
import { NotificationService } from './providers/notification.service';
import { SessionService } from './providers/session.service';
import { SettingsService } from './providers/settings.service';
import { ExternalService } from './providers/external.service';

@NgModule({
  imports: [SharedModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [HeaderComponent, NotificationSidebarComponent, NotificationListComponent],
  exports: [HeaderComponent, NotificationSidebarComponent, NotificationListComponent],
  providers: [NotificationService, SessionService, ExternalService, SettingsService]
})

export class CoreModule { }
