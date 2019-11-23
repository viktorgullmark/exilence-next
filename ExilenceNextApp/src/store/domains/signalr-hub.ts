import { persist } from 'mobx-persist';
import uuid from 'uuid';
import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { IGroup } from '../../interfaces/group.interface';

export class SignalrHub {
  @persist uuid: string = uuid.v4();
  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hub')
    .build();

  constructor() {
    this.connection.start().catch(err => document.write(err));
  }

  @action
  onJoinGroup(callback: (response: IGroup) => void) {
    this.connection.on('JoinGroup', callback);
  }

  @action
  sendJoinGroup(groupName: string) {
    this.connection.send('JoinGroup', groupName);
  }
}
