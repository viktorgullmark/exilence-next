import { Component, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { ElectronService } from './core/providers/electron.service';
import { BrowserHelper } from './shared/helpers/browser.helper';
import { NotificationSidebarPageComponent } from './core/containers/notification-sidebar-page/notification-sidebar-page.component';
import { StorageService } from './core/providers/storage.service';
import { ApplicationSession } from './shared/interfaces/application-session.interface';
import { Store } from '@ngrx/store';
import * as applicationActions from './store/application/application.actions';
import { first } from 'rxjs/operators';
import { ApplicationState, AppState } from './app.states';
import { initialState } from './store/application/application.reducer';
import { forkJoin } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private storageMap: StorageMap,
    private storageService: StorageService,
    private translate: TranslateService,
    private appStore: Store<AppState>
  ) {

    translate.setDefaultLang('en');

    if (electronService.isElectron()) {
      moment.locale(this.electronService.remote.app.getLocale());
    } else {
      moment.locale(BrowserHelper.getBrowserLang());
    }

    this.storageMap.get('appState').subscribe((res: ApplicationState) => {
      if (res !== undefined) {
        this.appStore.dispatch(new applicationActions.SetState({ state: res }));
      }
    });
  }
}
