import '../polyfills';
import 'reflect-metadata';

import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StorageModule } from '@ngx-pwa/local-storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ErrorHandler } from './core/error-handling/error-handler';
import { RequestInterceptor } from './core/error-handling/error-interceptor';
import { ElectronService } from './core/providers/electron.service';
import { SessionResolver } from './core/resolvers/session.resolver';
import { LoginModule } from './login/login.module';
import { WebviewDirective } from './shared/directives/webview.directive';
import { ApplicationEffects } from './store/application/application.effects';
import { metaReducers, reducers } from './store/reducers';

// NG Translate
// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatSnackBarModule,
    CoreModule,
    LoginModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    }),
    StorageModule.forRoot({
      IDBNoWrap: true
    }),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: false // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([
      ApplicationEffects
    ])
  ],
  providers: [ElectronService, ErrorHandler, SessionResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
