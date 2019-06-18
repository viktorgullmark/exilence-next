import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule, MatToolbarModule, MatSidenavModule, MatButtonModule } from '@angular/material';
import { NotificationSidebarComponent } from './components/notification-sidebar/notification-sidebar.component';

@NgModule({
  imports: [SharedModule, MatIconModule, MatButtonModule, MatToolbarModule, MatSidenavModule],
  declarations: [HeaderComponent, NotificationSidebarComponent],
  exports: [HeaderComponent, NotificationSidebarComponent]
})

export class CoreModule { }
