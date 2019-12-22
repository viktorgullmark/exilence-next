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
  catchError,
  mergeMap
} from 'rxjs/operators';
import { SignalrHub } from './domains/signalr-hub';
import { NotificationStore } from './notificationStore';
import { ISignalrEvent } from './signalrStore';
import { genericRetryStrategy } from '../utils/rxjs.utils';

export class RequestQueueStore {
  @observable failedEventsStack: ISignalrEvent<any>[] = [];

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
        'warning'
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
  filterEvents(event: string) {
    this.failedEventsStack = this.failedEventsStack.filter(
      fe => fe.method !== event
    );
  }

  @action
  retryFailedEvents() {
    fromStream(
      from(this.failedEventsStack).pipe(
        concatMap(event => {
          return this.runEventFromQueue(event).pipe(
            mergeMap(() => of(this.runEventFromQueueSuccess())),
            retryWhen(
              genericRetryStrategy({
                maxRetryAttempts: 5,
                scalingDuration: 2000
              })
            ),
            catchError(e => of(this.runEventFromQueueFail(e)))
          );
        })
      )
    );
  }

  @action
  runEventFromQueue<T>(event: ISignalrEvent<T>) {
    return event.stream
      ? this.signalrHub.stream<T>(event.method, event.stream, event.id)
      : this.signalrHub.invokeEvent<T>(event.method, event.object!, event.id);
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
  runEventFromQueueFail(e: Error) {
    this.notificationStore.createNotification('run_event_from_queue', 'error');
  }
}
