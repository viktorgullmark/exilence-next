import { SignalrHub } from './domains/signalr-hub';
import { action, observable, reaction, runInAction } from 'mobx';
import { Group } from './domains/group';
import { IGroup } from '../interfaces/group.interface';

export class SignalrStore {
  signalrHub: SignalrHub = new SignalrHub();

  @observable events: string[] = [];
  @observable activeGroup?: Group = undefined;

  constructor() {
    this.signalrHub.onJoinGroup(group => {
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
  onJoinGroup(group: IGroup) {
    this.activeGroup = new Group(group);
  }

  @action
  joinGroup(groupName: string) {
    this.signalrHub.sendJoinGroup(groupName);
  }
}
