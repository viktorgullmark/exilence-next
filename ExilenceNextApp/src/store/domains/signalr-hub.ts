import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { authService } from '../../services/auth.service';

export class SignalrHub {
  @persist uuid: string = uuid.v4();
  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5001/hub', { accessTokenFactory: () => uuid.v4() })
    .build();

  constructor() {
  }

  @action
  startConnection() {
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
}
