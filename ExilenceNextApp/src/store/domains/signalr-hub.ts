import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { Account } from './account';

export class SignalrHub {
  @persist uuid: string = uuid.v4();
  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hub')
    .build();

  constructor() {
    this.connection.start().catch(err => document.write(err));

    setTimeout(() => {

      const account = new Account({
        name: 'Umaycry',
        sessionId: ''
      });

      this.sendEvent('AccountLogin', account)


    }, 5000);


  }

  @action
  onEvent<T>(event: string, callback: (response: T) => void) {
    this.connection.on(event, callback);
  }

  @action
  sendEvent<T>(event: string, params: T): T {
    this.connection.send(event, params);
  }
}
