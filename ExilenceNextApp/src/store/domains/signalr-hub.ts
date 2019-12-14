import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { persist } from 'mobx-persist';
import { authService } from '../../services/auth.service';

export class SignalrHub {

  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hub')
    .build();

  constructor() {
  }

  @action
  startConnection(token: string) {

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/hub', { accessTokenFactory: () => token })
      .build();

    this.connection.start().catch((err: string) => document.write(err));
  }

  @action
  onEvent<T>(event: string, callback: (response: T) => void) {
    this.connection.on(event, callback);
  }

  @action
  sendEvent<T>(event: string, params: T) {
    this.connection.send(event, params);
  }

  @action
  sendEventWithId<T>(event: string, params: T, id: string) {
    this.connection.send(event, id, params);
  }
}
