import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetWorthPageComponent } from './net-worth/containers/net-worth-page/net-worth-page.component';

const routes: Routes = [
  { path: 'net-worth', component: NetWorthPageComponent },
  { path: '', redirectTo: '/auth/net-worth', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
