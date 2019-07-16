import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { StorageMap } from '@ngx-pwa/local-storage';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { skip } from 'rxjs/operators';

import { AppState } from './app.states';
import { SnapshotProgressSnackbarComponent } from './core/components/snapshot-progress-snackbar/snapshot-progress-snackbar.component';
import { ElectronService } from './core/providers/electron.service';
import { JsonService } from './core/providers/json.service';
import { StorageService } from './core/providers/storage.service';
import { BrowserHelper } from './shared/helpers/browser.helper';
import * as applicationActions from './store/application/application.actions';
import { ofType, Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('progressSnackbar', undefined) progressSnackbar: SnapshotProgressSnackbarComponent;

  constructor(public electronService: ElectronService,
    private storageMap: StorageMap,
    private translate: TranslateService,
    private appStore: Store<AppState>,
    private jsonService: JsonService,
    private storageService: StorageService,
    private actions$: Actions
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
    this.actions$.pipe(
      ofType(applicationActions.ApplicationActionTypes.LoadStateFromStorageFail,
        applicationActions.ApplicationActionTypes.LoadStateFromStorageSuccess)).mergeMap(() =>
          this.appStore.pipe(skip(2)).takeUntil(this.destroy$)).subscribe((state: AppState) => {
            this.storageMap.set('appState', state.applicationState).takeUntil(this.destroy$).subscribe();
          });
  }

  ngOnInit() {
    this.progressSnackbar.openSnackBar();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
