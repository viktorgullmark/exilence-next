import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { ICharacter } from '../../interfaces/character.interface';
import { Character } from './character';
import { Profile } from './profile';
import { IStashTab, IStash } from '../../interfaces/stash.interface';
import { fromStream } from 'mobx-utils';
import { externalService } from '../../services/external.service';
import { map, catchError } from 'rxjs/operators';
import { AxiosResponse } from 'axios';
import { stores } from './../../index';
import { of } from 'rxjs';
import { NotificationType } from '../../enums/notification-type.enum';

export class AccountLeague {
  @persist uuid: string = '';
  @persist leagueId: string = '';
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
          this.leagueId
        )
        .pipe(
          map((response: AxiosResponse<IStash>) => {
            runInAction(() => {
              if (response.data.tabs.length > 0) {
                this.stashtabs = response.data.tabs;
              }
              this.getStashTabsSuccess();
            });
          }),
          catchError((e: Error) => of(this.getStashTabsFail(e)))
        ),   
    );
  }

  @action getStashTabsSuccess() {
    stores.notificationStore.createNotification(
      'get_stash_tabs',
      NotificationType.Success
    );
  }

  @action getStashTabsFail(e: Error) {
    stores.notificationStore.createNotification(
      'get_stash_tabs',
      NotificationType.Error
    );
  }
}
