import { action, makeObservable, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import { interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import * as pkg from '../../package.json';
import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore.js';

export class UpdateStore {
  @observable currentVersion: string = pkg['version'];
  @observable pollingInterval: number = 60 * 1000 * 5;
  @observable updateAvailable: boolean = false;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
    fromStream(interval(this.pollingInterval).pipe(switchMap(() => of(this.checkForUpdate()))));

    electronService.ipcRenderer.on('updateDownloaded', () => {
      this.setUpdateReady(true);
    });
  }

  @action
  checkForUpdate() {
    electronService.ipcRenderer.send('checkForUpdates');
  }

  @action
  quitAndInstall() {
    electronService.ipcRenderer.send('quitAndInstall');
  }

  @action
  setUpdateReady(available: boolean) {
    this.updateAvailable = available;
  }
}
