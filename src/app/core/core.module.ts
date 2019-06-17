import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { MatIconModule, MatToolbarModule } from '@angular/material';

@NgModule({
  imports: [SharedModule, MatIconModule, MatToolbarModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})

export class CoreModule { }
