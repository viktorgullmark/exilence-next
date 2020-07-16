import { AxiosError, AxiosResponse } from 'axios';
import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ICharacter } from '../../interfaces/character.interface';
import { IStash, IStashTab } from '../../interfaces/stash.interface';
import { externalService } from '../../services/external.service';
import { Character } from './character';
import { rootStore } from '../..';

export class AccountLeague {
  @persist uuid: string = '';
  @persist leagueId: string = '';
  @persist('list', Character) @observable characters: Character[] = [];
  @persist('list') @observable stashtabs: IStashTab[] = [];

  private static readonly excludedStashTypes: string[] = ['UniqueStash', 'MapStash'];

  constructor(id: string) {
    this.leagueId = id;
  }

  @action
  updateCharacters(characters: ICharacter[]) {
    const newCharacters = characters.filter(
      c => this.characters.find(ec => ec.name === c.name) === undefined
    );
    this.characters = this.characters.concat(
      newCharacters.map(c => {
        return new Character(c);
      })
    );
  }

  @action
  getStashTabs() {
    return externalService
      .getStashTabs(rootStore.accountStore.getSelectedAccount.name!, this.leagueId)
      .pipe(
        map((response: AxiosResponse<IStash>) => {
          runInAction(() => {
            if (response.data.tabs.length > 0) {
              this.stashtabs = response.data.tabs.filter(
                (s: IStashTab) => !AccountLeague.excludedStashTypes.includes(s.type) 
              );
            }
            this.getStashTabsSuccess();
          });
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
