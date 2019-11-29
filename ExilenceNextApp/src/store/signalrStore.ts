import { SignalrHub } from './domains/signalr-hub';
import { action, observable, reaction, runInAction } from 'mobx';
import { Group } from './domains/group';
import { IGroup } from '../interfaces/group.interface';
import { Profile } from './domains/profile';

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

  @action
  joinGroup(groupName: string) {
    this.signalrHub.sendEvent<string>('JoinGroup', groupName);
  }

  @action
  updateProfile(profile: Profile) {
    this.signalrHub.sendEvent<Profile>('UpdateProfile', profile);
  }

  @action
  private onJoinGroup(group: IGroup) {
    this.activeGroup = new Group(group);
  }
}
