import { AxiosError, AxiosResponse } from 'axios';
import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ICharacter } from '../../interfaces/character.interface';
import { IStash, IStashTab } from '../../interfaces/stash.interface';
import { externalService } from '../../services/external.service';
import { stores } from './../../index';
import { Character } from './character';

export class AccountLeague {
  @persist uuid: string = '';
  @persist leagueId: string = '';
  @persist('list', Character) @observable characters: Character[] = [];
  @persist('list') @observable stashtabs: IStashTab[] = [];

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
      .getStashTabs(stores.accountStore.getSelectedAccount.name, this.leagueId)
      .pipe(
        map((response: AxiosResponse<IStash>) => {
          runInAction(() => {
            if (response.data.tabs.length > 0) {
              this.stashtabs = response.data.tabs;
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
    stores.notificationStore.createNotification(
      'get_stash_tabs',
      'success'
    );
  }

  @action getStashTabsFail(error: AxiosError) {
    stores.notificationStore.createNotification(
      'get_stash_tabs',
      'error',
      true
    );
  }
}
