import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { from } from 'rxjs';
import { stores } from '../..';
import { IApiStashTabPricedItem } from '../../interfaces/api/stashtab-priceditem.interface';
import AppConfig from './../../config/app.config';

export class SignalrHub {
  connection: signalR.HubConnection | undefined = undefined;

  constructor() {
    console.log('created hub');
  }

  @action
  startConnection(token: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConfig.baseUrl}/hub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
          return 10 * 1000;
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.connection
      .start()
      .then(() => {
        this.connection!.onreconnected(() => {
          stores.notificationStore.createNotification('reconnected', 'success');

          stores.signalrStore.setOnline(true);

          if (stores.requestQueueStore.failedEventsStack.length > 0) {
            stores.requestQueueStore.retryFailedEvents();
          }
        });

        this.connection!.onreconnecting(e => {
          this.connectionLost(e);
        });

        stores.signalrStore.setOnline(true);

        if (stores.requestQueueStore.failedEventsStack.length > 0) {
          stores.requestQueueStore.retryFailedEvents();
        }
      })
      .catch((err: string) => document.write(err));
  }

  @action
  onEvent<T>(event: string, callback: (response: T) => void) {
    this.connection!.on(event, callback);
  }

  @action
  sendEvent<T>(event: string, params: T, id?: string) {
    return from(
      id
        ? this.connection!.invoke<T>(event, params, id)
        : this.connection!.invoke<T>(event, params)
    );
  }

  @action
  async stream<T>(event: string, objects: T[], id?: string) {
    const subject = new signalR.Subject();
    var iteration = 0;
    await this.connection!.send(event, subject, id);
    const intervalHandle = setInterval(() => {
      subject.next(objects[iteration]);
      if (iteration === objects.length - 1) {
        clearInterval(intervalHandle);
        subject.complete();
      }
      iteration++;
    }, 250);
  }

  @action
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
