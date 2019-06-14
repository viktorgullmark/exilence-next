import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule
  ],
  exports: [
    CommonModule,
    TranslateModule,
    MatProgressBarModule
  ]
})

export class SharedModule { }
