import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { NetWorthModule } from './net-worth/net-worth.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NetWorthModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
