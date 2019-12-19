import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { from, Observable, of } from 'rxjs';
import { flatMap, mergeMap } from 'rxjs/operators';
import { ISignalrEvent } from './signalrStore';
import { SignalrHub } from './domains/signalr-hub';

export class RequestQueueStore {
  @observable @persist('list') failedEventsStack: ISignalrEvent<any>[] = [];

  constructor(private signalrHub: SignalrHub) {}

  @action
  queueFailedEvent<T>(event: ISignalrEvent<T>) {
    console.log('queueFailedEvent: ', event);
    this.failedEventsStack.push(event);
    console.log('failedEvents: ', this.failedEventsStack);
  }

  @action
  retryFailedEvents() {
    from(this.failedEventsStack).pipe(
      mergeMap(event => {
        // todo: trigger send event for event
        return flatMap(() => of(this.removeEventFromQueue(event)));
      })
    );
  }

  @action
  removeEventFromQueue<T>(event: ISignalrEvent<T>) {
    const peek = this.failedEventsStack[this.failedEventsStack.length - 1];
    // todo: remove request from queue since it finished
    // 1. peek at the top method / request to be run
    // 2. try to run it
    // 3. If successfull, shift it
    const removed = this.failedEventsStack.shift();
  }
}
