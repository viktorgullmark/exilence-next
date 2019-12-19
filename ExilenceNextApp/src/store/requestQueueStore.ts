import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { from, Observable, of } from 'rxjs';
import { flatMap, mergeMap } from 'rxjs/operators';
import { ISignalrEvent } from './signalrStore';
import { SignalrHub } from './domains/signalr-hub';

export class RequestQueueStore {
  @observable @persist('list') failedEvents: ISignalrEvent<any>[] = [];

  constructor(private signalrHub: SignalrHub) {}

  @action
  queueFailedEvent<T>(event: ISignalrEvent<T>) {
    this.failedEvents.push(event);
  }

  @action
  retryFailedEvents() {
    from(this.failedEvents).pipe(
      mergeMap(event => {
        // todo: trigger send event for event
        return flatMap(() => of(this.removeEventFromQueue(event)));
      })
    );
  }

  @action
  removeEventFromQueue<T>(event: ISignalrEvent<T>) {
    // todo: remove request from queue since it finished
  }
}
