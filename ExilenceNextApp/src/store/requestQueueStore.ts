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
  switchMap,
  take,
  retryWhen
} from 'rxjs/operators';
import { SignalrHub } from './domains/signalr-hub';
import { ISignalrEvent } from './signalrStore';
import { fromStream } from 'mobx-utils';

export class RequestQueueStore {
  @observable @persist('list') failedEventsStack: ISignalrEvent<any>[] = [];

  constructor(private signalrHub: SignalrHub) {}

  @action
  queueFailedEvent<T>(event: ISignalrEvent<T>) {
    this.failedEventsStack.push(event);
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
            }),
            retryWhen(errors => errors.pipe(delay(3000), take(5)))
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
}
