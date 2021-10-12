import { AxiosError, AxiosResponse } from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { defer, from, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { rootStore } from '../..';
import { ICharacter } from '../../interfaces/character.interface';
import { IStash, IStashTab } from '../../interfaces/stash.interface';
import { externalService } from '../../services/external.service';
import { Character } from './character';

export class AccountLeague {
  @persist uuid: string = '';
  @persist leagueId: string = '';
  @persist('list', Character) @observable characters: Character[] = [];
  @persist('list') @observable stashtabs: IStashTab[] = [];

  constructor(id: string) {
    makeObservable(this);
    this.leagueId = id;
  }

  @computed get stashtabList() {
    const flattenedTabs = this.stashtabs.flatMap((st) => {
      return st.children ?? st;
    });
    return flattenedTabs;
  }

  @action
  updateCharacters(characters: ICharacter[]) {
    const newCharacters = characters.filter(
      (c) => this.characters.find((ec) => ec.name === c.name) === undefined
    );
    this.characters = this.characters.concat(
      newCharacters.map((c) => {
        return new Character(c);
      })
    );
  }

  @action
  getStashTabs(checkHeaders?: boolean) {
    return externalService.getStashTabs(this.leagueId).pipe(
      map((response: AxiosResponse<IStash>) => {
        runInAction(() => {
          if (response.data.stashes.length > 0) {
            this.stashtabs = response.data.stashes;
          }
          this.getStashTabsSuccess();
        });
      }),
      switchMap(() => {
        const selectedStashTabs = this.stashtabList.filter(
          (st) =>
            rootStore.accountStore.getSelectedAccount.activeProfile?.activeStashTabIds.find(
              (ast) => ast === st.id
            ) !== undefined
        );
        // fetch first and set headers
        if (selectedStashTabs.length > 0 && checkHeaders) {
          const source = externalService
            .getStashTabWithChildren(selectedStashTabs[0], this.leagueId, false, true)
            .pipe(
              rootStore.rateLimitStore.rateLimiter1,
              rootStore.rateLimitStore.rateLimiter2,
              concatMap((tab: IStashTab) => of(tab))
            );
          return source;
        }
        return of(undefined);
      }),
      catchError((e: AxiosError) => {
        of(this.getStashTabsFail(e));
        throw e;
      })
    );
  }

  @action getStashTabsSuccess() {
    // todo: clean up, must be possible to write this in a nicer manner (perhaps a joint function for both error/success?)
    rootStore.notificationStore.createNotification(
      'get_stash_tabs',
      'success',
      undefined,
      undefined,
      this.leagueId
    );
  }

  @action getStashTabsFail(e: AxiosError | Error) {
    rootStore.notificationStore.createNotification(
      'get_stash_tabs',
      'error',
      true,
      e,
      this.leagueId
    );
  }
}
