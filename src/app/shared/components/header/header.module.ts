import { NgModule } from '@angular/core';
import { MatIconModule, MatToolbarModule } from '@angular/material';

import { SharedModule } from '../../shared.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    SharedModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class HeaderModule { }
