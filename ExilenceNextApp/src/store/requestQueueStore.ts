import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { from } from 'rxjs';
import { delay, flatMap, map, mergeMap, retry } from 'rxjs/operators';
import { SignalrHub } from './domains/signalr-hub';
import { ISignalrEvent } from './signalrStore';

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
        return flatMap(() =>
          this.runEventFromQueue(event).pipe(
            map(() => {
              this.failedEventsStack.shift();
              console.log('event removed, queue now:', this.failedEventsStack);
            }),
            delay(3000),
            retry(5)
          )
        );
      })
    );
  }

  @action
  runEventFromQueue<T>(event: ISignalrEvent<T>) {
    return this.signalrHub.sendEvent<T>(event.method, event.object, event.id);
  }
}
