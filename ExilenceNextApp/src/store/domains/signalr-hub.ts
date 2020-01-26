import * as signalR from '@microsoft/signalr';
import { action, observable, runInAction } from 'mobx';
import { from, throwError, of } from 'rxjs';
import { stores } from '../..';
import AppConfig from './../../config/app.config';
import * as msgPack from '@microsoft/signalr-protocol-msgpack';

export class SignalrHub {
  @observable connection: signalR.HubConnection | undefined = undefined;

  constructor() {}

  @action
  stopConnection() {
    if (!this.connection) {
      return throwError('error:not_connected');
    }
    return from(
      this.connection.stop().then(() => {
        stores.signalrStore.setOnline(false);
      })
    );
  }

  @action
  startConnection(token: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConfig.baseUrl}/hub`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
          return 30 * 1000;
        }
      })
      .withHubProtocol(new msgPack.MessagePackHubProtocol())
      .build();

    stores.signalrStore.registerEvents();

    return from(
      this.connection
        .start()
        .then(() => {
          this.connection!.onreconnected(() => {
            stores.notificationStore.createNotification(
              'reconnected',
              'success'
            );
            stores.signalrStore.setOnline(true);
            stores.accountStore.initSession(true);
          });

          this.connection!.onreconnecting(e => {
            stores.signalrStore.setActiveGroup(undefined);
            this.connectionLost(e);
          });

          this.connection!.onclose(e => {
            runInAction(() => {
              this.connection = undefined;
            });
          });

          stores.signalrStore.setOnline(true);
        })
        .catch((err: string) => console.log(err))
    );
  }

  onEvent<T, T2 = {}, T3 = {}, T4 = {}>(
    event: string,
    callback: (arg1: T, arg2?: T2, arg3?: T3, arg4?: T4) => void
  ) {
    this.connection!.on(event, callback);
  }

  invokeEvent<T>(event: string, args: T | T[], id?: string) {
    if (!this.connection) {
      return throwError('error:not_connected');
    }
    return from(
      id
        ? this.connection!.invoke(event, args, id)
        : this.connection!.invoke(event, args)
    );
  }

  sendEvent<T = {}>(event: string, params?: T | T[], id?: string) {
    if (!this.connection) {
      return throwError('error:not_connected');
    }
    return from(
      id
        ? this.connection!.send(event, params, id)
        : this.connection!.send(event, params)
    );
  }

  stream<T>(event: string, objects: T[], id?: string) {
    const subject = new signalR.Subject();
    let iteration = 0;
    const promise = this.connection!.invoke(event, subject, id);
    const intervalHandle = setInterval(() => {
      subject.next(objects[iteration]);
      if (iteration === objects.length - 1) {
        clearInterval(intervalHandle);
        subject.complete();
      }
      iteration++;
    }, 250);
    return from(promise);
  }

  connectionLost(e?: Error) {
    stores.signalrStore.setOnline(false);
    stores.notificationStore.createNotification(
      'connection_lost',
      'error',
      false,
      e
    );
  }
}
