import { action, observable } from "mobx";
import { persist } from "mobx-persist";
import { IAccount } from "../../interfaces/account.interface";
import { ILeague } from "../../interfaces/league.interface";
import { League } from "./league";

export class Account implements IAccount {
  @persist name: string;
  @persist @observable sessionId: string;
  @persist('list', League) @observable leagues: League[] = [];

  constructor(obj?: IAccount) {
      this.name = obj ? obj.name : '';
      this.sessionId = obj ? obj.sessionId : '';
  }

  @action
  addLeague(league: ILeague) {
    this.leagues.push(new League(league));
  }
}
