import { action, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import { externalService } from '../services/external.service';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IGithubRelease } from '../interfaces/github/github-release.interface';
import { AxiosError } from 'axios';
import { of, interval } from 'rxjs';
import * as pkg from '../../package.json';
import { NotificationStore } from './notificationStore';

export class UpdateStore {
  @observable latestRelease: IGithubRelease | undefined = undefined;
  @observable currentVersion: string = pkg['version'];
  @observable pollingInterval: number = 30 * 1000;

  constructor(private notificationStore: NotificationStore) {
    fromStream(
      interval(this.pollingInterval).pipe(
        switchMap(() => of(this.checkForUpdate()))
      )
    );
  }

  @action
  checkForUpdate() {
    fromStream(
      externalService.getLatestRelease().pipe(
        map(response => {
          this.checkForUpdateSuccess(response.data);
        }),
        catchError((e: AxiosError) => {
          return of(this.checkForUpdateFail(e));
        })
      )
    );
  }

  @action
  checkForUpdateFail(e: AxiosError) {
    this.notificationStore.createNotification(
      'check_for_update',
      'error',
      false,
      e
    );
  }

  @action
  checkForUpdateSuccess(release: IGithubRelease) {
    this.latestRelease = release;

    if (this.latestRelease.name !== this.currentVersion) {
      this.notificationStore.createNotification('new_update_found', 'success');
    }
  }
}
