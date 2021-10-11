import localForage from 'localforage';
import { action, makeObservable, observable } from 'mobx';
import { persist } from 'mobx-persist';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';

import { RootStore } from './rootStore';
import { fromStream } from 'mobx-utils';
import { rootStore } from '..';

export class MigrationStore {
  @observable @persist current: number = 2;
  @observable latest: number = 3;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

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
      localForage.iterate((_value, key) => {
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
            concatMap((key) => {
              return from(localForage.removeItem(key));
            })
          )
        );
      })
    );
  }

  @action
  runClearStorage() {
    fromStream(this.clearStorage());
  }

  @action
  runMigrations() {
    this.rootStore.routeStore.redirect('/login');
    // @ts-ignore
    return from([...Array(this.latest - this.current).keys()])
      .pipe(
        concatMap(() => {
          let observable: Observable<void | {}> = of({});
          switch (this.current) {
            case 1:
              // from version 1
              observable = this.clearStorage();
              break;
            case 2:
              // from version 2
              observable = this.clearStorage();
              rootStore.uiStateStore.setShouldShowWhatsNewModal(true);
              break;
            default:
              break;
          }
          this.increment();
          return observable;
        })
      )
      .pipe(catchError(() => of(this.decrement())));
  }
}
