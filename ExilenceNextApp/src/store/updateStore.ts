import { action, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import { interval, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as pkg from '../../package.json';
import { electronService } from '../services/electron.service';

export class UpdateStore {
  @observable currentVersion: string = pkg['version'];
  @observable pollingInterval: number = 60 * 1000 * 5;

  constructor() {
    fromStream(
      interval(this.pollingInterval).pipe(
        switchMap(() => of(this.checkForUpdate()))
      )
    );
  }

  @action
  checkForUpdate() {
    electronService.ipcRenderer.send('checkForUpdates');
  }
}
