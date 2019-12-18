import { SignalrHub } from './domains/signalr-hub';
import { action, observable, reaction, runInAction } from 'mobx';
import { Group } from './domains/group';
import { IGroup } from '../interfaces/group.interface';
import { Profile } from './domains/profile';
import { stores } from '..';
import { Snapshot } from './domains/snapshot';
import { IApiSnapshot } from '../interfaces/api/snapshot.interface';
import { fromStream } from 'mobx-utils';
import { map, catchError } from 'rxjs/operators';
import { of, from } from 'rxjs';
import { IApiStashTabSnapshot } from '../interfaces/api/stash-tab-snapshot.interface';
import { IApiPricedItem } from '../interfaces/api/priceditem.interface';
import { IApiStashTabPricedItem } from '../interfaces/api/stashtab-priceditem.interface';

export class SignalrStore {
  signalrHub: SignalrHub = new SignalrHub();

  @observable events: string[] = [];
  @observable activeGroup?: Group = undefined;

  constructor() {
    this.signalrHub.onEvent<IGroup>('JoinGroup', group => {
      this.onJoinGroup(group);
    });

    reaction(
      () => this.activeGroup,
      _data => {
        if (this.activeGroup) {
          alert(`joined group ${this.activeGroup.name}`);
        }
      }
    );
  }

  /* #region Group */
  @action
  joinGroup(groupName: string) {
    fromStream(
      this.signalrHub.sendEvent<string>('JoinGroup', groupName).pipe(
        map((res: IGroup) => {
          console.log('Joined group', res);
        }),
        catchError((e: Error) => of(console.log(e)))
      )
    );
  }

  @action
  private onJoinGroup(group: IGroup) {
    this.activeGroup = new Group(group);
  }
  /* #endregion */

  /* #region Profile */
  @action
  createProfile(profile: Profile) {
    fromStream(
      this.signalrHub.sendEvent<Profile>('AddProfile', profile).pipe(
        map((res: Profile) => {
          console.log('Added profile', res);
        }),
        catchError((e: Error) => of(console.log(e)))
      )
    );
  }

  @action
  updateProfile(profile: Profile) {
    const profileToSend = <Profile>Object.assign(profile);
    profileToSend.snapshots = [];
    fromStream(
      this.signalrHub.sendEvent<Profile>('EditProfile', profile).pipe(
        map((res: Profile) => {
          console.log('Edited profile', res);
        }),
        catchError((e: Error) => of(console.log(e)))
      )
    );
  }

  @action
  removeProfile(uuid: string) {
    fromStream(
      this.signalrHub.sendEvent<string>('RemoveProfile', uuid).pipe(
        map((res: Profile) => {
          console.log('Removed profile', res);
        }),
        catchError((e: Error) => of(console.log(e)))
      )
    );
  }
  /* #endregion */

  /* #region Snapshot */
  @action
  createSnapshot(snapshot: IApiSnapshot, profileId: string) {
    fromStream(
      this.signalrHub
        .sendEvent<IApiSnapshot>('AddSnapshot', snapshot, profileId)
        .pipe(
          map((res: IApiSnapshot) => {
            console.log('Added snapshot', res);
          }),
          catchError((e: Error) => of(console.log(e)))
        )
    );
  }

  @action
  streamItems(stashtabs: IApiStashTabPricedItem[]) {
    fromStream(
      from(this.signalrHub.streamItems(stashtabs)).pipe(
        map(() => {
          console.log('Successful');
        }),
        catchError((e: Error) => of(console.log(e)))
      )
    );
  }

  /* #endregion */
}
