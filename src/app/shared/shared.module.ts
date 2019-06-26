import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material';
import { LetDirective } from './directives/nglet.directive';

@NgModule({
  declarations: [LetDirective],
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule,
    LetDirective
  ]
})

export class SharedModule { }
