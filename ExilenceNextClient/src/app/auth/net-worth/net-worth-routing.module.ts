import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NetWorthPageComponent } from './containers/net-worth-page/net-worth-page.component';

const routes: Routes = [
  { path: '', component: NetWorthPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NetWorthRoutingModule { }
