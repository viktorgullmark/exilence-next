import { IApiStashTabSnapshot } from './api-stash-tab-snapshot.interface';

export interface IApiSnapshot {
  uuid: string;
  created: Date;
  stashTabs: IApiStashTabSnapshot[];
}
