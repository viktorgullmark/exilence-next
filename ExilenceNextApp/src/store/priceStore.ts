import { UiStateStore } from './uiStateStore';
import { LeagueStore } from './leagueStore';

export class PriceStore {
  constructor(private uiStateStore: UiStateStore, private leagueStore: LeagueStore) {
  }
}
