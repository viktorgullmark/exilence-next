import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { from, of } from 'rxjs';
import {
  delay,
  flatMap,
  map,
  mergeMap,
  retry,
  concatMap,
  switchMap
} from 'rxjs/operators';
import { SignalrHub } from './domains/signalr-hub';
import { ISignalrEvent } from './signalrStore';
import { fromStream } from 'mobx-utils';

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
    fromStream(
      from(this.failedEventsStack).pipe(
        concatMap(event => {
          return this.runEventFromQueue(event).pipe(
            map(() => {
              runInAction(() => {
                this.failedEventsStack.shift();
              });
              console.log('event removed, queue now:', this.failedEventsStack);
            }),
            delay(3000),
            retry(5)
          );
        })
      )
    );
  }

  @action
  runEventFromQueue<T>(event: ISignalrEvent<T>) {
    return this.signalrHub.sendEvent<T>(event.method, event.object, event.id);
  }
}
