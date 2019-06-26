import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'net-worth', loadChildren: () => import('./net-worth/net-worth.module').then(mod => mod.NetWorthModule) },
  { path: '', redirectTo: '/auth/net-worth', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
