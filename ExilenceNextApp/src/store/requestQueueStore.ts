import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { from, Observable, of } from 'rxjs';
import { flatMap, mergeMap } from 'rxjs/operators';

export class RequestQueueStore {
  @observable @persist('list') failedRequests: Observable<any>[] = [];

  constructor() {}

  @action
  queueFailedRequest(request: Observable<any>) {
    this.failedRequests.push(request);
  }

  @action
  retryFailedRequests() {
    from(this.failedRequests).pipe(
      mergeMap(request => {
        return flatMap(() => of(this.removeRequestFromQueue(request)));
      })
    );
  }

  @action
  removeRequestFromQueue(request: Observable<any>) {
    // todo: remove request from queue since it finished
  }
}
