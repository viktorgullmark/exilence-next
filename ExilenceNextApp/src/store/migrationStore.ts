import localForage from 'localforage';
import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';

export class MigrationStore {
  @observable @persist current: number = 1;
  @observable latest: number = 2;

  constructor() {}

  @action
  increment() {
    this.current++;
  }

  @action
  decrement() {
    this.current--;
  }

  @action
  clearStorage() {
    const itemsToRemove: string[] = [];
    localForage.iterate((value, key, iterationNumber) => {
      if (!key.includes('migration')) {
        itemsToRemove.push(key);
      }
    });

    if (itemsToRemove.length === 0) {
      return of({});
    }

    return from(itemsToRemove).pipe(
      concatMap(key => {
        return from(localForage.removeItem(key));
      })
    );
  }

  @action
  runMigrations() {
    return from([...Array(this.latest - this.current).keys()])
      .pipe(
        concatMap(() => {
          let observable: Observable<void | {}> = of({});
          switch (this.current) {
            case 1:
              // version 1
              observable = this.clearStorage();
              break;
            default:
              break;
          }
          this.increment();
          return observable;
        })
      )
      .pipe(catchError((e: Error) => of(this.decrement())));
  }
}
