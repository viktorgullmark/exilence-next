import { AxiosError } from 'axios';
import { action, computed, observable, runInAction } from 'mobx';
import { fromStream } from 'mobx-utils';
import moment from 'moment';
import { forkJoin, from, of } from 'rxjs';
import { catchError, concatMap, map, retryWhen } from 'rxjs/operators';
import uuid from 'uuid';
import { IApiConnection } from '../interfaces/api/api-connection.interface';
import { IApiGroup } from '../interfaces/api/api-group.interface';
import { IApiPricedItemsUpdate } from '../interfaces/api/api-priced-items-update.interface';
import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { genericRetryStrategy } from '../utils/rxjs.utils';
import { mapSnapshotToApiSnapshot } from '../utils/snapshot.utils';
import { Group } from './domains/group';
import { Snapshot } from './domains/snapshot';
import stores from '.';

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

  @action
  registerEvents() {
    stores.signalrHub.onEvent('OnCloseConnection', () => {
      fromStream(
        stores.signalrHub.stopConnection().pipe(
          map(() => of(this.stopConnectionSuccess())),
          catchError(e => of(this.stopConnectionFail(e)))
        )
      );
    });
    stores.signalrHub.onEvent<IApiGroup>('OnGroupEntered', group => {
      this.setActiveGroup(new Group(group));
      this.activeGroup!.setActiveAccounts(
        group.connections.map(c => c.account.uuid)
      );
      this.joinGroupSuccess();
    });
    stores.signalrHub.onEvent('OnGroupLeft', () => {
      this.setActiveGroup(undefined);
      this.leaveGroupSuccess();
    });
    stores.signalrHub.onEvent<IApiConnection>('OnJoinGroup', connection => {
      this.activeGroup!.addConnection(connection);
    });
    stores.signalrHub.onEvent<IApiConnection>('OnLeaveGroup', connection => {
      this.activeGroup!.removeConnection(connection.connectionId);
    });
    stores.signalrHub.onEvent<string, string, IApiSnapshot>(
      'OnAddSnapshot',
      (connectionId, profileId, snapshot) => {
        if (this.activeGroup && snapshot && profileId) {
          this.addSnapshotToConnection(snapshot, connectionId, profileId);
        }
      }
    );
    stores.signalrHub.onEvent<string, string>(
      'OnRemoveAllSnapshots',
      (connectionId, profileId) => {
        if (this.activeGroup && profileId) {
          this.removeAllSnapshotsForConnection(connectionId, profileId);
        }
      }
    );
    stores.signalrHub.onEvent<string, IApiProfile>(
      'OnChangeProfile',
      (connectionId, profile) => {
        if (this.activeGroup && profile) {
          this.changeProfileForConnection(connectionId, profile);
        }
      }
    );
    stores.signalrHub.onEvent<string, IApiProfile>(
      'OnAddProfile',
      (connectionId, profile) => {
        if (this.activeGroup && profile) {
          this.addProfileToConnection(connectionId, profile);
        }
      }
    );
    stores.signalrHub.onEvent<string, string>(
      'OnRemoveProfile',
      (connectionId, profileId) => {
        if (this.activeGroup && profileId) {
          this.removeProfileFromConnection(connectionId, profileId);
        }
      }
    );
  }

  @computed
  get ownConnection() {
    return this.activeGroup!.connections.find(
      c => c.account.name === stores.accountStore.getSelectedAccount.name
    )!;
  }

  @action
  signOut() {
    fromStream(
      stores.signalrHub.stopConnection().pipe(
        map(() => {
          this.stopConnectionSuccess();
          stores.routeStore.redirect('/login');
          this.signOutSuccess();
        }),
        catchError(e => {
          // connection probably doesnt exist
          this.stopConnectionFail(e);
          stores.routeStore.redirect('/login');
          return of(this.signOutFail(e));
        })
      )
    );
  }

  @action
  signOutFail(e: Error) {
    stores.notificationStore.createNotification('sign_out', 'error', true, e);
  }

  @action
  signOutSuccess() {
    stores.notificationStore.createNotification('sign_out', 'success');
  }

  @action
  changeProfileForConnection(connectionId: string, profile: IApiProfile) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === connectionId
    );

    if (connection) {
      runInAction(() => {
        connection.account.profiles = connection.account.profiles.map(p => {
          p.active = false;
          return p;
        });
      });
      let foundProfile = connection.account.profiles.find(
        p => p.uuid === profile.uuid
      );
      if (foundProfile) {
        const index = connection.account.profiles.indexOf(foundProfile);
        profile.snapshots = foundProfile.snapshots;
        runInAction(() => {
          connection.account.profiles[index] = profile;
        });
      } else {
        connection.account.profiles.push(profile);
      }
      this.changeProfileForConnectionSuccess();
    } else {
      this.changeProfileForConnectionFail(
        new Error('error:connection_not_found')
      );
    }
  }

  @action
  changeProfileForConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'change_profile_for_connection',
      'error',
      false,
      e
    );
  }

  @action
  changeProfileForConnectionSuccess() {
    stores.notificationStore.createNotification(
      'change_profile_for_connection',
      'success'
    );
  }

  @action
  stopConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'stop_connection',
      'error',
      false,
      e
    );
  }

  @action
  stopConnectionSuccess() {
    stores.notificationStore.createNotification('stop_connection', 'success');
  }

  @action
  addProfileToConnection(connectionId: string, profile: IApiProfile) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === connectionId
    );

    if (connection) {
      if (!connection.account.profiles.find(p => p.uuid === profile.uuid)) {
        runInAction(() => {
          connection.account.profiles.push(profile);
        });
        this.addProfileToConnectionSuccess();
      } else {
        this.addProfileToConnectionFail(
          new Error('error:profile_already_exists')
        );
      }
    } else {
      this.addProfileToConnectionFail(new Error('error:connection_not_found'));
    }
  }

  @action
  addProfileToConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'add_profile_to_connection',
      'error',
      false,
      e
    );
  }

  @action
  addProfileToConnectionSuccess() {
    stores.notificationStore.createNotification(
      'add_profile_to_connection',
      'success'
    );
  }

  @action
  removeAllSnapshotsForConnection(connectionId: string, profileId: string) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === connectionId
    );

    if (connection) {
      const profile = connection.account.profiles.find(
        p => p.uuid === profileId
      );

      if (profile) {
        runInAction(() => {
          profile.snapshots = [];
        });

        this.removeProfileFromConnectionSuccess();
      } else {
        this.removeProfileFromConnectionFail(
          new Error('error:profile_not_found')
        );
      }
    } else {
      this.removeAllSnapshotsForConnectionFail(
        new Error('error:connection_not_found')
      );
    }
  }

  @action
  removeAllSnapshotsForConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'remove_all_snapshots_for_connection',
      'error',
      false,
      e
    );
  }

  @action
  removeAllSnapshotsForConnectionSuccess() {
    stores.notificationStore.createNotification(
      'remove_all_snapshots_for_connection',
      'success'
    );
  }

  @action
  removeProfileFromConnection(connectionId: string, profileId: string) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === connectionId
    );

    if (connection) {
      const profile = connection.account.profiles.find(
        p => p.uuid === profileId
      );

      if (profile) {
        const index = connection.account.profiles.indexOf(profile);

        runInAction(() => {
          connection.account.profiles.splice(index, 1);
        });

        this.removeProfileFromConnectionSuccess();
      } else {
        this.removeProfileFromConnectionFail(
          new Error('error:profile_not_found')
        );
      }
    } else {
      this.removeProfileFromConnectionFail(
        new Error('error:connection_not_found')
      );
    }
  }

  @action
  removeProfileFromConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'remove_profile_from_connection',
      'error',
      false,
      e
    );
  }

  @action
  removeProfileFromConnectionSuccess() {
    stores.notificationStore.createNotification(
      'remove_profile_from_connection',
      'success'
    );
  }

  @action
  getLatestSnapshotForProfile(connectionId: string, profileUuid: string) {
    if (this.online) {
      fromStream(
        stores.signalrHub
          .invokeEvent('GetLatestSnapshotForProfile', profileUuid)
          .pipe(
            map((snapshot: IApiSnapshot) => {
              this.addSnapshotToConnection(snapshot, connectionId, profileUuid);
              this.getLatestSnapshotForProfileSuccess();
            }),
            retryWhen(
              genericRetryStrategy({
                maxRetryAttempts: 5,
                scalingDuration: 5000
              })
            ),
            catchError((e: AxiosError) =>
              of(this.getLatestSnapshotForProfileFail(e))
            )
          )
      );
    }
  }

  @action
  getLatestSnapshotForProfileFail(e: Error) {
    stores.notificationStore.createNotification(
      'retrieve_latest_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  getLatestSnapshotForProfileSuccess() {
    stores.notificationStore.createNotification(
      'retrieve_latest_snapshot',
      'success'
    );
  }

  @action
  addSnapshotToConnection(
    snapshot: IApiSnapshot,
    connectionId: string,
    profileId: string
  ) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === connectionId
    );

    if (connection) {
      const connIndex = this.activeGroup!.connections.indexOf(connection);
      const profile = connection.account.profiles.find(
        p => p.uuid === profileId
      );
      if (profile) {
        if (!profile.snapshots.find(s => s.uuid === snapshot.uuid)) {
          runInAction(() => {
            profile.snapshots.unshift(snapshot);
            this.activeGroup!.connections[connIndex] = connection;
          });
          this.addSnapshotToConnectionSuccess();
        } else {
          this.addSnapshotToConnectionFail(
            new Error('error:snapshot_already_received')
          );
        }
      } else {
        this.addSnapshotToConnectionFail(new Error('error:profile_not_found'));
      }
    } else {
      this.addSnapshotToConnectionFail(new Error('error:connection_not_found'));
    }
  }

  @action
  addSnapshotToConnectionFail(e: Error) {
    stores.notificationStore.createNotification(
      'retrieve_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  addSnapshotToConnectionSuccess() {
    stores.notificationStore.createNotification('retrieve_snapshot', 'success');
  }

  @action
  setOnline(online: boolean) {
    this.online = online;
    if (!online) {
      stores.uiStateStore.toggleGroupOverview(false);
    }
  }

  @action
  joinGroup(groupName: string, password: string) {
    stores.uiStateStore.setJoiningGroup(true);

    if (this.online) {
      fromStream(
        stores.signalrHub
          .sendEvent<IApiGroup>('JoinGroup', <IApiGroup>{
            uuid: uuid.v4(),
            name: groupName,
            password: password,
            created: moment.utc().toDate(),
            connections: []
          })
          .pipe(
            retryWhen(
              genericRetryStrategy({
                maxRetryAttempts: 5,
                scalingDuration: 5000
              })
            ),
            catchError((e: AxiosError) => of(this.joinGroupFail(e)))
          )
      );
    } else {
      this.joinGroupFail(new Error('error:not_connected'));
    }
  }

  @action addOwnSnapshotToActiveGroup(snapshot: Snapshot) {
    const activeProfile = stores.accountStore.getSelectedAccount.activeProfile;

    if (!activeProfile) {
      throw new Error('error:no_active_profile');
    }

    const activeGroupProfile = this.ownConnection.account.profiles.find(
      p => p.uuid === activeProfile.uuid
    );
    if (!activeGroupProfile) {
      throw new Error('error:profile_not_found_on_server');
    } else {
      // clear items from other snapshots
      activeGroupProfile.snapshots = activeGroupProfile.snapshots
        .map(ps => {
          ps.stashTabs.map(psst => {
            psst.pricedItems = [];
            return psst;
          });
          return ps;
        })
        .slice(0, 100);
      activeGroupProfile.snapshots.unshift(mapSnapshotToApiSnapshot(snapshot));
    }
  }

  @action
  setActiveGroup(g: Group | undefined) {
    this.activeGroup = g;
  }

  @action
  joinGroupFail(e: Error | AxiosError) {
    stores.uiStateStore.setJoiningGroup(false);
    stores.notificationStore.createNotification(
      'join_group',
      'error',
      false,
      e
    );

    if (e.message.includes('password')) {
      stores.uiStateStore.setGroupError(e);
    } else {
      stores.notificationStore.createNotification(
        'join_group',
        'error',
        true,
        e
      );
    }
  }

  @action
  sendSnapshotToGroupSuccess() {
    stores.notificationStore.createNotification(
      'send_snapshot_to_group',
      'success'
    );
  }

  @action
  sendSnapshotToGroupFail(e: Error | AxiosError) {
    stores.notificationStore.createNotification(
      'send_snapshot_to_group',
      'error',
      false,
      e
    );
  }

  @action
  joinGroupSuccess() {
    stores.uiStateStore.setJoiningGroup(false);
    stores.notificationStore.createNotification('join_group', 'success');
    stores.uiStateStore!.setTimeSinceLastSnapshotLabel(this.activeGroup?.timeSinceLastSnapshot);
    stores.uiStateStore.setGroupDialogOpen(false);
  }

  @action
  leaveGroup() {
    stores.uiStateStore.setLeavingGroup(true);
    if (!this.activeGroup) {
      this.leaveGroupFail(new Error('error:not_in_group'));
      return;
    }
    if (this.online) {
      fromStream(
        stores.signalrHub
          .sendEvent<string>('LeaveGroup', this.activeGroup.name)
          .pipe(
            retryWhen(
              genericRetryStrategy({
                maxRetryAttempts: 5,
                scalingDuration: 5000
              })
            ),
            catchError((e: AxiosError) => of(this.leaveGroupFail(e)))
          )
      );
    } else {
      this.leaveGroupFail(new Error('error:not_connected'));
    }
  }

  @action
  leaveGroupFail(e: AxiosError | Error) {
    stores.uiStateStore.setLeavingGroup(false);
    stores.notificationStore.createNotification(
      'leave_group',
      'error',
      false,
      e
    );
  }

  @action
  leaveGroupSuccess() {
    stores.uiStateStore.setLeavingGroup(false);
    stores.notificationStore.createNotification('leave_group', 'success');
  }

  @action
  groupExists(groupName: string) {
    if (this.online) {
      fromStream(
        stores.signalrHub.invokeEvent<string>('GroupExists', groupName).pipe(
          map((name: string) => {
            if (name) {
              stores.uiStateStore.setGroupExists(true);
            } else {
              stores.uiStateStore.setGroupExists(false);
            }
            return this.groupExistsSuccess();
          }),
          retryWhen(
            genericRetryStrategy({
              maxRetryAttempts: 5,
              scalingDuration: 5000
            })
          ),
          catchError((e: AxiosError) => of(this.groupExistsFail(e)))
        )
      );
    } else {
      this.groupExistsFail(new Error('error:not_connected'));
    }
  }

  @action
  groupExistsSuccess() {}

  @action
  groupExistsFail(e: AxiosError | Error) {
    stores.notificationStore.createNotification(
      'group_exists',
      'error',
      false,
      e
    );
  }

  @action
  uploadItems(
    stashtabs: IApiStashTabPricedItem[],
    profileId: string,
    snapshotId: string
  ) {
    return forkJoin(
      from(stashtabs).pipe(
        concatMap(st => {
          const items: IApiPricedItemsUpdate = {
            profileId: profileId,
            stashTabId: st.uuid,
            snapshotId: snapshotId,
            pricedItems: st.pricedItems
          } as IApiPricedItemsUpdate;

          return stores.signalrHub
            .invokeEvent<IApiPricedItemsUpdate>('AddPricedItems', items)
            .pipe(
              map(() => this.uploadItemsSuccess()),
              retryWhen(
                genericRetryStrategy({
                  maxRetryAttempts: 5,
                  scalingDuration: 5000
                })
              ),
              catchError((e: Error) => of(this.uploadItemsFail(e)))
            );
        })
      )
    );
  }

  @action
  uploadItemsFail(e: Error) {
    stores.notificationStore.createNotification(
      'upload_items',
      'error',
      false,
      e
    );
  }

  @action
  uploadItemsSuccess() {
    stores.notificationStore.createNotification('upload_items', 'success');
  }
}
