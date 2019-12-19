import * as signalR from '@microsoft/signalr';
import { action } from 'mobx';
import { from } from 'rxjs';
import { stores } from '../..';
import { IApiStashTabPricedItem } from '../../interfaces/api/stashtab-priceditem.interface';
import AppConfig from './../../config/app.config';

export class SignalrHub {
  connection: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(`${AppConfig.baseUrl}/hub`)
    .build();

  constructor() {}

  @action
  startConnection(token: string) {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${AppConfig.baseUrl}/hub`, { accessTokenFactory: () => token })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: () => {
          return 30 * 1000;
        }
      })
      .build();

    this.connection
      .start()
      .then(() => {
        this.connection.onreconnected(() => {
          stores.notificationStore.createNotification('reconnected', 'success');

          if (stores.requestQueueStore.failedEventsStack.length > 0) {
            stores.requestQueueStore.retryFailedEvents();
          }
        });

        this.connection.onreconnecting(e => {
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
    this.connection.on(event, callback);
  }

  @action
  sendEvent<T>(event: string, params: T, id?: string) {
    return from(
      id
        ? this.connection.invoke<T>(event, params, id)
        : this.connection.invoke<T>(event, params)
    );
  }

  @action
  async streamItems(stashtabs: IApiStashTabPricedItem[]) {
    const subject = new signalR.Subject();
    stashtabs.forEach(async tab => {
      var iteration = 0;
      await this.connection.send('AddPricedItems', subject, tab.stashTabId);
      const intervalHandle = setInterval(() => {
        iteration++;
        subject.next(tab.pricedItems[iteration]);
        if (iteration === tab.pricedItems.length - 1) {
          clearInterval(intervalHandle);
          subject.complete();
        }
      }, 250);
    });
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
