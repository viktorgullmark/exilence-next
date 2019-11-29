import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { Account } from './account';

export class SignalrHub {
  @persist uuid: string = uuid.v4();
  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hub', { accessTokenFactory: () => "" })
    .build();

  constructor() {
    //this.connection.start().catch((err: string) => document.write(err));

    // setTimeout(() => {

    //   this.sendEvent('JoinGroup', "ABC123")

    // }, 5000);


  }

  @action
  onEvent<T>(event: string, callback: (response: T) => void) {
    this.connection.on(event, callback);
  }

  @action
  sendEvent<T>(event: string, params: T) {
    this.connection.send(event, params);
  }
}
