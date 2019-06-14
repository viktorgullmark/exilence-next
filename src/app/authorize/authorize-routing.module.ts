import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NetWorthComponent } from './net-worth/net-worth.component';

const routes: Routes = [
  { path: 'net-worth', component: NetWorthComponent },
  { path: '', redirectTo: '/auth/net-worth', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthorizeRoutingModule { }
