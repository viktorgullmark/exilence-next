import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { ApplicationState, AppState } from './app.states';
import { ElectronService } from './core/providers/electron.service';
import { BrowserHelper } from './shared/helpers/browser.helper';
import * as applicationActions from './store/application/application.actions';
import { skip } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public electronService: ElectronService,
    private storageMap: StorageMap,
    private translate: TranslateService,
    private appStore: Store<AppState>
  ) {

    this.translate.setDefaultLang('en');

    if (electronService.isElectron()) {
      moment.locale(this.electronService.remote.app.getLocale());
    } else {
      moment.locale(BrowserHelper.getBrowserLang());
    }

    // load state from storage
    this.storageMap.get('appState').subscribe((res: ApplicationState) => {
      if (res !== undefined) {
        this.appStore.dispatch(new applicationActions.SetState({ state: res }));
      }
    });

    // save state to storage on changes
    this.appStore.pipe(skip(1)).subscribe((state: AppState) => {
      this.storageMap.set('appState', state.applicationState).subscribe();
    });
  }
}
