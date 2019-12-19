import { action, observable, reaction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { IApiProfile } from '../interfaces/api/profile.interface';
import { IApiSnapshot } from '../interfaces/api/snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/stashtab-priceditem.interface';
import { IGroup } from '../interfaces/group.interface';
import { Group } from './domains/group';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { RequestQueueStore } from './requestQueueStore';

export class SignalrStore {
  signalrHub: SignalrHub = new SignalrHub();
  @observable online: boolean = false;
  @observable events: string[] = [];
  @observable activeGroup?: Group = undefined;

  constructor(
    private notificationStore: NotificationStore,
    private requestQueueStore: RequestQueueStore
  ) {
    reaction(
      () => this.activeGroup,
      _data => {
        if (this.activeGroup) {
          alert(`joined group ${this.activeGroup.name}`);
        }
      }
    );
  }

  @action
  handleRequest<T>(
    request: Observable<T>,
    successCallback: () => void,
    failCallback: (e: Error) => void
  ) {
    this.online
      ? fromStream(
          request.pipe(
            map(() => {
              successCallback();
            }),
            catchError((e: Error) => {
              this.requestQueueStore.queueFailedRequest(request)
              return of(failCallback(e));
            })
          )
        )
      : this.requestQueueStore.queueFailedRequest(request);
  }

  @action
  setOnline(online: boolean) {
    this.online = online;
  }

  /* #region Group */
  @action
  joinGroup(groupName: string) {
    fromStream(
      this.signalrHub
        .sendEvent<IGroup>('JoinGroup', <IGroup>{
          name: groupName,
          created: new Date(),
          connections: []
        })
        .pipe(
          map((g: IGroup) => {
            this.activeGroup = new Group(g);
            this.joinGroupSuccess();
          }),
          catchError((e: Error) => of(this.joinGroupFail(e)))
        )
    );
  }

  @action
  joinGroupFail(e: Error) {
    this.notificationStore.createNotification(
      'api_join_group',
      'error',
      false,
      e
    );
  }

  @action
  joinGroupSuccess() {
    this.notificationStore.createNotification('api_join_group', 'success');
  }
  /* #endregion */

  /* #region Profile */
  @action
  createProfile(profile: IApiProfile) {
    const request = this.signalrHub.sendEvent<IApiProfile>(
      'AddProfile',
      profile
    );

    this.handleRequest(
      request,
      this.createProfileSuccess,
      this.createProfileFail
    );
  }

  @action
  createProfileFail(e: Error) {
    this.notificationStore.createNotification(
      'api_create_profile',
      'error',
      false,
      e
    );
  }

  @action
  createProfileSuccess() {
    this.notificationStore.createNotification('api_create_profile', 'success');
  }

  @action
  updateProfile(profile: IApiProfile) {
    fromStream(
      this.signalrHub.sendEvent<IApiProfile>('EditProfile', profile).pipe(
        map(() => {
          this.updateProfileSuccess();
        }),
        catchError((e: Error) => of(this.updateProfileFail(e)))
      )
    );
  }

  @action
  updateProfileFail(e: Error) {
    this.notificationStore.createNotification(
      'api_update_profile',
      'error',
      false,
      e
    );
  }

  @action
  updateProfileSuccess() {
    this.notificationStore.createNotification('api_update_profile', 'success');
  }

  @action
  removeProfile(uuid: string) {
    fromStream(
      this.signalrHub.sendEvent<string>('RemoveProfile', uuid).pipe(
        map(() => {
          this.removeProfileSuccess();
        }),
        catchError((e: Error) => of(this.removeProfileFail(e)))
      )
    );
  }

  @action
  removeProfileFail(e: Error) {
    this.notificationStore.createNotification(
      'api_remove_profile',
      'error',
      false,
      e
    );
  }

  @action
  removeProfileSuccess() {
    this.notificationStore.createNotification('api_remove_profile', 'success');
  }
  /* #endregion */

  /* #region Snapshot */
  @action
  createSnapshot(snapshot: IApiSnapshot, profileId: string) {
    fromStream(
      this.signalrHub
        .sendEvent<IApiSnapshot>('AddSnapshot', snapshot, profileId)
        .pipe(
          map(() => {
            this.createSnapshotSuccess();
          }),
          catchError((e: Error) => of(this.createSnapshotFail(e)))
        )
    );
  }

  @action
  createSnapshotFail(e: Error) {
    this.notificationStore.createNotification(
      'api_create_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  createSnapshotSuccess() {
    this.notificationStore.createNotification('api_create_snapshot', 'success');
  }

  @action
  removeSnapshot(uuid: string) {
    fromStream(
      this.signalrHub.sendEvent<string>('RemoveSnapshot', uuid).pipe(
        map(() => {
          this.removeSnapshotSuccess();
        }),
        catchError((e: Error) => of(this.removeSnapshotFail(e)))
      )
    );
  }

  @action
  removeSnapshotFail(e: Error) {
    this.notificationStore.createNotification(
      'api_remove_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  removeSnapshotSuccess() {
    this.notificationStore.createNotification('api_remove_snapshot', 'success');
  }

  @action
  uploadItems(stashtabs: IApiStashTabPricedItem[]) {
    fromStream(
      from(this.signalrHub.streamItems(stashtabs)).pipe(
        map(() => {
          this.uploadItemsSuccess();
        }),
        catchError((e: Error) => of(this.uploadItemsFail(e)))
      )
    );
  }

  @action
  uploadItemsFail(e: Error) {
    this.notificationStore.createNotification(
      'api_upload_items',
      'error',
      false,
      e
    );
  }

  @action
  uploadItemsSuccess() {
    this.notificationStore.createNotification('api_upload_items', 'success');
  }

  /* #endregion */
}
