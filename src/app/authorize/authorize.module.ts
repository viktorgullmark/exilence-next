import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthorizeRoutingModule } from './authorize-routing.module';
import { NetWorthModule } from './net-worth/net-worth.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NetWorthModule,
    AuthorizeRoutingModule
  ]
})
export class AuthorizeModule { }
