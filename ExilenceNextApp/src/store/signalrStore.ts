import { AxiosError } from 'axios';
import { action, computed, observable, reaction, runInAction } from 'mobx';
import { fromStream } from 'mobx-utils';
import { from, of, empty, forkJoin } from 'rxjs';
import { catchError, concatMap, map, switchMap, concat } from 'rxjs/operators';
import uuid from 'uuid';
import { stores } from '..';
import { IApiGroup } from '../interfaces/api/api-group.interface';
import { IApiPricedItemsUpdate } from '../interfaces/api/api-priced-items-update.interface';
import { IApiProfile } from '../interfaces/api/api-profile.interface';
import { IApiSnapshot } from '../interfaces/api/api-snapshot.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/api-stashtab-priceditem.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { SnapshotUtils } from '../utils/snapshot.utils';
import { Group } from './domains/group';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { UiStateStore } from './uiStateStore';
import { Snapshot } from './domains/snapshot';
import { IApiConnection } from '../interfaces/api/api-connection.interface';

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
    public signalrHub: SignalrHub
  ) {
    reaction(
      () => signalrHub!.connection,
      (_conn, reaction) => {
        if (_conn) {
          signalrHub.onEvent<IApiConnection>('OnJoinGroup', connection => {
            this.activeGroup!.addConnection(connection);
          });
          signalrHub.onEvent<IApiConnection>('OnLeaveGroup', connection => {
            this.activeGroup!.removeConnection(connection.connectionId);
          });
          signalrHub.onEvent<string, string, IApiSnapshot>(
            'OnAddSnapshot',
            (connectionId, profileId, snapshot) => {
              if (this.activeGroup && snapshot && profileId) {
                console.log('Before OnAddSnapshot', this.activeGroup);
                this.addSnapshotToConnection(snapshot, connectionId, profileId);
              }
            }
          );
          signalrHub.onEvent<IApiPricedItemsUpdate>(
            'OnAddPricedItems',
            pricedItemsUpdate => {
              if (this.activeGroup) {
                console.log('Before OnAddPricedItems', this.activeGroup);
                this.addPricedItemsToStashTab(pricedItemsUpdate);
              }
            }
          );
          signalrHub.onEvent<string, string>(
            'OnRemoveAllSnapshots',
            (connectionId, profileId) => {
              if (this.activeGroup && profileId) {
                console.log('Before OnRemoveAllSnapshots', this.activeGroup);
                // todo: should remove all snapshots in group
              }
            }
          );
        }
        reaction.dispose();
      }
    );
  }

  @computed
  get ownConnection() {
    return this.activeGroup!.connections.find(
      c => c.account.name === stores.accountStore.getSelectedAccount.name
    )!;
  }

  // todo: test this thoroughly
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
        runInAction(() => {
          snapshot.tabsFetchedCount = 0;
          profile.snapshots.unshift(snapshot);
          this.activeGroup!.connections[connIndex] = connection;
        });
        console.log('After AddSnapshot', this.activeGroup);
        this.addSnapshotToConnectionSuccess();
      } else {
        this.addSnapshotToConnectionFail(new Error('error:profile_not_found'));
      }
    } else {
      this.addSnapshotToConnectionFail(new Error('error:connection_not_found'));
    }
  }

  // todo: test this thoroughly
  @action
  addPricedItemsToStashTab(pricedItemsUpdate: IApiPricedItemsUpdate) {
    const connection = this.activeGroup!.connections.find(
      c => c.connectionId === pricedItemsUpdate.connectionId
    );

    if (connection) {
      const connIndex = this.activeGroup!.connections.indexOf(connection);
      const profile = connection.account.profiles.find(
        p => p.uuid === pricedItemsUpdate.profileId
      );
      if (profile) {
        const snapshot = profile.snapshots.find(
          ss => ss.uuid === pricedItemsUpdate.snapshotId
        );

        snapshot!.tabsFetchedCount++;

        const stashTab = snapshot!.stashTabs.find(
          st => st.uuid === pricedItemsUpdate.stashTabId
        );

        stashTab!.pricedItems = stashTab!.pricedItems.concat(
          pricedItemsUpdate.pricedItems
        );

        this.activeGroup!.connections[connIndex] = connection;

        console.log('After AddPricedItems', this.activeGroup);
        this.addSnapshotToConnectionSuccess();
      } else {
        this.addSnapshotToConnectionFail(new Error('error:profile_not_found'));
      }
    } else {
      this.addSnapshotToConnectionFail(new Error('error:connection_not_found'));
    }
  }

  @action
  addSnapshotToConnectionFail(e: Error) {
    this.notificationStore.createNotification(
      'retrieve_snapshot',
      'error',
      false,
      e
    );
  }

  @action
  addSnapshotToConnectionSuccess() {
    this.notificationStore.createNotification('retrieve_snapshot', 'success');
  }

  @action
  setOnline(online: boolean) {
    this.online = online;
    if (!online) {
      this.uiStateStore.toggleGroupOverview(false);
    }
  }

  @action
  joinGroup(groupName: string, password: string) {
    this.uiStateStore.setJoiningGroup(true);
    const profile = stores.accountStore.getSelectedAccount.activeProfile;

    // todo: error handling if no snapshots
    const snapshotToSend: Snapshot = { ...profile.snapshots[0] };

    const activeAccountLeague = stores.accountStore.getSelectedAccount.accountLeagues.find(
      al => al.leagueId === profile.activeLeagueId
    );
    if (activeAccountLeague) {
      if (this.online && activeAccountLeague) {
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
                g = this.applyOwnSnapshotsToGroup(g);
                this.setActiveGroup(new Group(g));
                this.activeGroup!.setActiveAccounts(
                  g.connections.map(c => c.account.uuid)
                );
              }),
              switchMap(() => {
                // sends latest snapshot to group members
                if (profile.snapshots.length === 0) {
                  return of(this.joinGroupSuccess());
                }
                const apiItems = SnapshotUtils.mapSnapshotsToStashTabPricedItems(
                  snapshotToSend,
                  activeAccountLeague.stashtabs
                );
                const apiSnapshot = SnapshotUtils.mapSnapshotToApiSnapshot(
                  snapshotToSend,
                  activeAccountLeague.stashtabs
                );
                return profile
                  .sendSnapshot(
                    apiSnapshot,
                    apiItems,
                    this.sendSnapshotToGroupSuccess,
                    this.sendSnapshotToGroupFail
                  )
                  .pipe(
                    map(() => {
                      return this.joinGroupSuccess();
                    })
                  );
              }),
              catchError((e: Error) => of(this.joinGroupFail(e)))
            )
        );
      } else {
        this.joinGroupFail(new Error('error:not_connected'));
      }
    }
  }

  @action applyOwnSnapshotsToGroup(g: IApiGroup) {
    const activeProfile = g.connections
      .find(
        c => c.account.name === stores.accountStore.getSelectedAccount.name
      )!
      .account.profiles.find(
        p =>
          p.uuid === stores.accountStore.getSelectedAccount.activeProfile.uuid
      );

    if (!activeProfile) {
      throw new Error('error:profile_not_found_on_server');
    } else {
      activeProfile.snapshots = stores.accountStore.getSelectedAccount.activeProfile.snapshots.map(
        s => SnapshotUtils.mapSnapshotToApiSnapshot(s)
      );
    }
    return g;
  }

  @action addOwnSnapshotToActiveGroup(snapshot: Snapshot) {
    const activeProfile = this.ownConnection.account.profiles.find(
      p => p.uuid === stores.accountStore.getSelectedAccount.activeProfile.uuid
    );
    if (!activeProfile) {
      throw new Error('error:profile_not_found_on_server');
    } else {
      activeProfile.snapshots.unshift(
        SnapshotUtils.mapSnapshotToApiSnapshot(snapshot)
      );
    }
  }

  @action
  setActiveGroup(g: Group | undefined) {
    this.activeGroup = g;
  }

  @action
  joinGroupFail(e: Error | AxiosError) {
    this.uiStateStore.setJoiningGroup(false);
    this.notificationStore.createNotification('join_group', 'error', false, e);

    if (e.message.includes('password')) {
      this.uiStateStore.setGroupError(e);
    } else {
      this.notificationStore.createNotification('join_group', 'error', true, e);
    }
  }

  @action
  sendSnapshotToGroupSuccess() {
    this.notificationStore.createNotification(
      'send_snapshot_to_group',
      'success'
    );
  }

  @action
  sendSnapshotToGroupFail(e: Error | AxiosError) {
    this.notificationStore.createNotification(
      'send_snapshot_to_group',
      'error',
      false,
      e
    );
  }

  @action
  joinGroupSuccess() {
    this.uiStateStore.setJoiningGroup(false);
    this.notificationStore.createNotification('join_group', 'success');
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
            connections: [this.ownConnection]
          })
          .pipe(
            map((g: IApiGroup) => {
              this.setActiveGroup(undefined);
              this.leaveGroupSuccess();
            }),
            catchError((e: AxiosError) => of(this.leaveGroupFail(e)))
          )
      );
    } else {
      this.leaveGroupFail(new Error('error:not_connected'));
    }
  }

  @action
  leaveGroupFail(e: AxiosError | Error) {
    this.notificationStore.createNotification('leave_group', 'error', false, e);
  }

  @action
  leaveGroupSuccess() {
    this.notificationStore.createNotification('leave_group', 'success');
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
    this.notificationStore.createNotification(
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

          return this.signalrHub
            .invokeEvent<IApiPricedItemsUpdate>('AddPricedItems', items)
            .pipe(
              map(() => this.uploadItemsSuccess()),
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
