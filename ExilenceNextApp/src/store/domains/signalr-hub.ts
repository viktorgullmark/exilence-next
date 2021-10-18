import * as signalR from '@microsoft/signalr';
import * as msgPack from '@microsoft/signalr-protocol-msgpack';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { from, throwError } from 'rxjs';

import { randomIntFromInterval } from '../../utils/misc.utils';
import { RootStore } from '../rootStore';
import AppConfig from './../../config/app.config';

export class SignalrHub {
  @observable connection: signalR.HubConnection | undefined = undefined;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  stopConnection() {
    if (!this.connection) {
      return throwError('error:not_connected');
    }
    return from(
      this.connection.stop().then(() => {
        this.rootStore.signalrStore.setOnline(false);
      })
    );
  }

  @action
  startConnection(token: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConfig.baseUrl}/hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
          return 30 * 1000 + randomIntFromInterval(0, 10 * 1000);
        },
      })
      .withHubProtocol(new msgPack.MessagePackHubProtocol())
      .build();

    this.rootStore.signalrStore.registerEvents();

    return from(
      this.connection
        .start()
        .then(() => {
          this.connection!.onreconnected(() => {
            this.rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
            this.rootStore.notificationStore.createNotification('reconnected', 'success');
            this.rootStore.signalrStore.setOnline(true);
            this.rootStore.accountStore.initSession(true);
          });

          this.connection!.onreconnecting((e) => {
            this.rootStore.signalrStore.setActiveGroup(undefined);
            this.connectionLost(e);
          });

          this.connection!.onclose(() => {
            runInAction(() => {
              this.connection = undefined;
            });
          });

          this.rootStore.signalrStore.setOnline(true);
        })
        .catch((err: string) => {
          if (!AppConfig.production) {
            console.log(err);
          }
        })
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
      id ? this.connection!.invoke(event, args, id) : this.connection!.invoke(event, args)
    );
  }

  sendEvent<T = {}>(event: string, params?: T | T[], id?: string) {
    if (!this.connection) {
      return throwError('error:not_connected');
    }
    return from(
      id ? this.connection!.send(event, params, id) : this.connection!.send(event, params)
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
    this.rootStore.signalrStore.setOnline(false);
    this.rootStore.notificationStore.createNotification('connection_lost', 'error', false, e);
  }
}
