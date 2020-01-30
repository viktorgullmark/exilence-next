import localForage from 'localforage';
import { action, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';
import stores from '.';

export class MigrationStore {
  @observable @persist current: number = 1;
  @observable latest: number = 2;

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
    return from(
      localForage.iterate((value, key, iterationNumber) => {
        if (!key.includes('migration')) {
          itemsToRemove.push(key);
        }
      })
    ).pipe(
      switchMap(() => {
        if (itemsToRemove.length === 0) {
          return of({});
        }

        return forkJoin(
          from(itemsToRemove).pipe(
            concatMap(key => {
              return from(localForage.removeItem(key));
            })
          )
        );
      })
    );
  }

  @action
  runMigrations() {
    stores.routeStore.redirect('/login');
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
