import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import {
  MatIconModule, MatToolbarModule, MatSidenavModule, MatButtonModule, MatExpansionModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { NotificationSidebarComponent } from './components/notification-sidebar/notification-sidebar.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotificationService } from './providers/notification.service';

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
  providers: [NotificationService]
})

export class CoreModule { }
