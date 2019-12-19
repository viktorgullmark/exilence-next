import { action, observable, reaction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { from, of } from 'rxjs';
import { catchError, map, concatMap, switchMap } from 'rxjs/operators';
import { stores } from '..';
import { IApiProfile } from '../interfaces/api/profile.interface';
import { IApiSnapshot } from '../interfaces/api/snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/stashtab-priceditem.interface';
import { IGroup } from '../interfaces/group.interface';
import { Group } from './domains/group';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { RequestQueueStore } from './requestQueueStore';

export interface ISignalrEvent<T> {
  method: string;
  object: T;
  stream?: T[];
  id?: string;
}

export class SignalrStore {
  @observable online: boolean = false;
  @observable events: string[] = [];
  @observable activeGroup?: Group = undefined;

  constructor(
    private notificationStore: NotificationStore,
    private requestQueueStore: RequestQueueStore,
    public signalrHub: SignalrHub
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
    event: ISignalrEvent<T>,
    successCallback: () => void,
    failCallback: (e: Error) => void
  ) {
    this.online
      ? fromStream(
          this.signalrHub.sendEvent(event.method, event.object, event.id).pipe(
            map(() => {
              return successCallback();
            }),
            catchError((e: Error) => {
              this.requestQueueStore.queueFailedEvent(event);
              return of(failCallback(e));
            })
          )
        )
      : this.requestQueueStore.queueFailedEvent(event);
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
    const request: ISignalrEvent<IApiProfile> = {
      method: 'AddProfile',
      object: profile
    };

    this.handleRequest(
      request,
      this.createProfileSuccess,
      this.createProfileFail
    );
  }

  @action
  createProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_create_profile',
      'error',
      false,
      e
    );
  }

  @action
  createProfileSuccess() {
    stores.notificationStore.createNotification(
      'api_create_profile',
      'success'
    );
  }

  @action
  updateProfile(profile: IApiProfile) {
    const request: ISignalrEvent<IApiProfile> = {
      method: 'EditProfile',
      object: profile
    };

    this.handleRequest(
      request,
      this.updateProfileSuccess,
      this.updateProfileFail
    );
  }

  @action
  updateProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_update_profile',
      'error',
      false,
      e
    );
  }

  @action
  updateProfileSuccess() {
    stores.notificationStore.createNotification(
      'api_update_profile',
      'success'
    );
  }

  @action
  removeProfile(uuid: string) {
    const request: ISignalrEvent<string> = {
      method: 'AddProfile',
      object: uuid
    };

    this.handleRequest(
      request,
      this.removeProfileSuccess,
      this.removeProfileFail
    );
  }

  @action
  removeProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_remove_profile',
      'error',
      false,
      e
    );
  }

  @action
  removeProfileSuccess() {
    stores.notificationStore.createNotification(
      'api_remove_profile',
      'success'
    );
  }
  /* #endregion */

  /* #region Snapshot */
  @action
  createSnapshot(snapshot: IApiSnapshot, profileId: string) {
    const request: ISignalrEvent<IApiSnapshot> = {
      method: 'AddSnapshot',
      object: snapshot,
      id: profileId
    };

    this.handleRequest(
      request,
      this.createSnapshotSuccess,
      this.createSnapshotFail
    );
  }

  @action
  createSnapshotFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_create_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  createSnapshotSuccess() {
    stores.notificationStore.createNotification(
      'api_create_snapshot',
      'success'
    );
  }

  @action
  removeSnapshot(uuid: string) {
    const request: ISignalrEvent<string> = {
      method: 'RemoveSnapshot',
      object: uuid
    };

    this.handleRequest(
      request,
      this.removeSnapshotSuccess,
      this.removeSnapshotFail
    );
  }

  @action
  removeSnapshotFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_remove_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  removeSnapshotSuccess() {
    stores.notificationStore.createNotification(
      'api_remove_snapshot',
      'success'
    );
  }

  @action
  uploadItems(stashtabs: IApiStashTabPricedItem[]) {
    fromStream(
      from(stashtabs).pipe(
        concatMap(tab => {
          return this.signalrHub.stream(
            'AddPricedItems',
            tab.pricedItems,
            tab.stashTabId
          );
        }),
        switchMap(() => of(this.uploadItemsSuccess())),
        catchError((e: Error) => of(this.uploadItemsFail(e)))
      )
    );
  }

  @action
  uploadItemsFail(e: Error) {
    stores.notificationStore.createNotification(
      'api_upload_items',
      'error',
      false,
      e
    );
  }

  @action
  uploadItemsSuccess() {
    stores.notificationStore.createNotification('api_upload_items', 'success');
  }

  /* #endregion */
}
