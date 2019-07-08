import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { skip } from 'rxjs/operators';

import { AppState } from './app.states';
import { ProgressSnackbarComponent } from './core/components/progress-snackbar/progress-snackbar.component';
import { ElectronService } from './core/providers/electron.service';
import { JsonService } from './core/providers/json.service';
import { StorageService } from './core/providers/storage.service';
import { BrowserHelper } from './shared/helpers/browser.helper';
import * as applicationActions from './store/application/application.actions';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('progressSnackbar', undefined) progressSnackbar: ProgressSnackbarComponent;

  constructor(public electronService: ElectronService,
    private storageMap: StorageMap,
    private translate: TranslateService,
    private appStore: Store<AppState>,
    private jsonService: JsonService,
    private storageService: StorageService
  ) {

    // this.jsonService.testJsonPatch();

    this.translate.setDefaultLang('en');

    if (electronService.isElectron()) {
      moment.locale(this.electronService.remote.app.getLocale());
    } else {
      moment.locale(BrowserHelper.getBrowserLang());
    }

    // load state from storage
    this.appStore.dispatch(new applicationActions.LoadStateFromStorage());

    // save state to storage on changes
    this.appStore.pipe(skip(1)).subscribe((state: AppState) => {
      this.storageMap.set('appState', state.applicationState).subscribe();
    });
  }

  ngOnInit() {
    this.progressSnackbar.openSnackBar();
  }
}
