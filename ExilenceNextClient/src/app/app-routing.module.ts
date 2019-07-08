import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login/containers/login-page/login-page.component';
import { SessionResolver } from './core/resolvers/session.resolver';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(mod => mod.AuthModule),
        resolve: { networth: SessionResolver }
    },

    { path: 'login', component: LoginPageComponent },
    { path: '', redirectTo: '/auth/false', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
