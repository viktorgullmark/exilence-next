import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { fromStream } from 'mobx-utils';
import { from, of } from 'rxjs';
import {
  concatMap,
  delay,
  map,
  retryWhen,
  take,
  catchError
} from 'rxjs/operators';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { ISignalrEvent } from './signalrStore';

export class RequestQueueStore {
  @observable @persist('list') failedEventsStack: ISignalrEvent<any>[] = [];

  constructor(
    private signalrHub: SignalrHub,
    private notificationStore: NotificationStore
  ) {}

  @action
  queueFailedEvent<T>(event: ISignalrEvent<T>) {
    this.failedEventsStack.push(event);

    if (this.failedEventsStack.length % 25 === 0) {
      this.notificationStore.createNotification(
        'data_will_be_cleared',
        'warning',
        true
      );
    }

    // clear failed events related to snapshots
    if (this.failedEventsStack.length > 50) {
      this.failedEventsStack = this.failedEventsStack.filter(
        fe => fe.method !== 'AddPricedItems' && fe.method !== 'AddSnapshot'
      );
      this.notificationStore.createNotification('data_was_cleared', 'info');
    }
  }

  @action
  retryFailedEvents() {
    fromStream(
      from(this.failedEventsStack).pipe(
        concatMap(event => {
          return this.runEventFromQueue(event).pipe(
            map(() => this.runEventFromQueueSuccess()),
            retryWhen(errors => errors.pipe(delay(5000), take(5))),
            catchError((e: Error) => of(this.runEventFromQueueFail))
          );
        })
      )
    );
  }

  @action
  runEventFromQueue<T>(event: ISignalrEvent<T>) {
    return event.stream
      ? this.signalrHub.stream<T>(event.method, event.stream, event.id)
      : this.signalrHub.sendEvent<T>(event.method, event.object!, event.id);
  }

  @action
  runEventFromQueueSuccess() {
    this.failedEventsStack.shift();

    this.notificationStore.createNotification(
      'run_event_from_queue',
      'success'
    );
  }

  @action
  runEventFromQueueFail() {
    this.notificationStore.createNotification(
      'run_event_from_queue',
      'error'
    );
  }
}
