import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { ICharacter } from '../../interfaces/character.interface';
import { Character } from './character';
import { Profile } from './profile';
import { IStashTab, IStash } from '../../interfaces/stash.interface';
import { fromStream } from 'mobx-utils';
import { externalService } from '../../services/external.service';
import { map } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { stores } from './../../index';

export class AccountLeague {
  @persist uuid: string = '';

  @persist('list', Character) @observable characters: Character[] = [];
  @persist('list') @observable stashtabs: IStashTab[] = [];

  constructor() {}

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
    fromStream(
      externalService
        .getStashTabs(
          stores.accountStore.getSelectedAccount.name,
          stores.leagueStore.leagues.find(l => l.uuid === this.uuid)!.id
        )
        .pipe(
          map((response: AxiosResponse<IStash>) => {
            runInAction(() => {
              this.stashtabs = response.data.tabs;
            });
          })
        )
    );
  }
}
