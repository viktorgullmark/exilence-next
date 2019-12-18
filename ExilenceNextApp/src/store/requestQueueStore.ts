import { action, observable } from 'mobx';
import { fromStream } from 'mobx-utils';
import { persist } from 'mobx-persist';
import { Observable, from, of } from 'rxjs';
import { map, concatMap, switchMap } from 'rxjs/operators';

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
      concatMap(request => {
        return switchMap(() => request);
      })
    );
  }
}
