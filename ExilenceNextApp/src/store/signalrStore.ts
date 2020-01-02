import { action, observable, reaction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { from, of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { stores } from '..';
import { IApiPricedItem } from '../interfaces/api/api-priced-item.interface';
import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IApiGroup } from '../interfaces/api/api-group.interface';
import { Group } from './domains/group';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { RequestQueueStore } from './requestQueueStore';
import { UiStateStore } from './uiStateStore';
import uuid from 'uuid';

export interface ISignalrEvent<T> {
  method: string;
  object?: T | T[];
  stream?: T[];
  id?: string;
}

export class SignalrStore {
  @observable online: boolean = false;
  @observable events: string[] = [];
  @observable activeGroup?: Group = undefined;

  constructor(
    private uiStateStore: UiStateStore,
    private notificationStore: NotificationStore,
    private requestQueueStore: RequestQueueStore,
    public signalrHub: SignalrHub
  ) {}

  @action
  handleRequest<T>(
    event: ISignalrEvent<T>,
    successCallback: () => void,
    failCallback: (e: Error) => void
  ) {
    if (this.online) {
      return (event.stream
        ? this.signalrHub.stream(event.method, event.stream, event.id)
        : this.signalrHub.invokeEvent(event.method, event.object, event.id)
      ).pipe(
        map(() => {
          return successCallback();
        }),
        catchError((e: Error) => {
          this.requestQueueStore.queueFailedEvent(event);
          return of(failCallback(e));
        })
      );
    } else {
      this.requestQueueStore.queueFailedEvent(event);
      return of(failCallback(new Error('error:not_connected')));
    }
  }

  @action
  setOnline(online: boolean) {
    this.online = online;
  }

  /* #region Group */
  @action
  joinGroup(groupName: string, password: string) {
    if (this.online) {
      fromStream(
        this.signalrHub
          .invokeEvent<IApiGroup>('JoinGroup', <IApiGroup>{
            uuid: uuid.v4(),
            name: groupName,
            password: password,
            created: new Date(),
            connections: []
          })
          .pipe(
            map((g: IApiGroup) => {
              this.setActiveGroup(new Group(g));
              this.joinGroupSuccess();
            }),
            catchError((e: Error) => of(this.joinGroupFail(e)))
          )
      );
    } else {
      this.joinGroupFail(new Error('error:not_connected'));
    }
  }

  @action
  setActiveGroup(g: Group | undefined) {
    this.activeGroup = g;
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
    this.uiStateStore.setGroupDialogOpen(false);
  }

  @action
  leaveGroup() {
    if (!this.activeGroup) {
      this.leaveGroupFail(new Error('error:not_in_group'));
      return;
    }
    if (this.online) {
      fromStream(
        this.signalrHub
          .invokeEvent<IApiGroup>('LeaveGroup', <IApiGroup>{
            uuid: uuid.v4(),
            name: this.activeGroup.name,
            created: new Date(),
            connections: []
          })
          .pipe(
            map((g: IApiGroup) => {
              this.setActiveGroup(undefined);
              this.leaveGroupSuccess();
            }),
            catchError((e: Error) => of(this.leaveGroupFail(e)))
          )
      );
    } else {
      this.leaveGroupFail(new Error('error:not_connected'));
    }
  }

  @action
  leaveGroupFail(e: Error) {
    this.notificationStore.createNotification(
      'api_leave_group',
      'error',
      false,
      e
    );
  }

  @action
  leaveGroupSuccess() {
    this.notificationStore.createNotification('api_leave_group', 'success');
  }

  @action
  groupExists(groupName: string) {
    if (this.online) {
      fromStream(
        this.signalrHub.invokeEvent<string>('GroupExists', groupName).pipe(
          map((name: string) => {
            if (name) {
              this.uiStateStore.setGroupExists(true);
            } else {
              this.uiStateStore.setGroupExists(false);
            }
            return this.groupExistsSuccess();
          }),
          catchError((e: Error) => of(this.groupExistsFail(e)))
        )
      );
    } else {
      this.groupExistsFail(new Error('error:not_connected'));
    }
  }

  @action
  groupExistsSuccess() {}

  @action
  groupExistsFail(e: Error) {
    this.notificationStore.createNotification(
      'api_group_exists',
      'error',
      false,
      e
    );
  }

  /* #endregion */

  /* #region Profile */
  @action
  createProfile(profile: IApiProfile) {
    const request: ISignalrEvent<IApiProfile> = {
      method: 'AddProfile',
      object: profile
    };

    fromStream(
      this.handleRequest(
        request,
        this.createProfileSuccess,
        this.createProfileFail
      )
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

    fromStream(
      this.handleRequest(
        request,
        this.updateProfileSuccess,
        this.updateProfileFail
      )
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
      method: 'RemoveProfile',
      object: uuid
    };

    fromStream(
      this.handleRequest(
        request,
        this.removeProfileSuccess,
        this.removeProfileFail
      )
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

    return this.handleRequest(
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

    fromStream(
      this.handleRequest(
        request,
        this.removeSnapshotSuccess,
        this.removeSnapshotFail
      )
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
        concatMap(st => {
          const request: ISignalrEvent<IApiPricedItem> = {
            method: 'AddPricedItems',
            id: st.stashTabId,
            object: st.pricedItems
          };
          return this.handleRequest(
            request,
            this.uploadItemsSuccess,
            this.uploadItemsFail
          ).pipe(
            map(() => this.uploadItemsSuccess),
            catchError((e: Error) => of(this.uploadItemsFail(e)))
          );
        })
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
