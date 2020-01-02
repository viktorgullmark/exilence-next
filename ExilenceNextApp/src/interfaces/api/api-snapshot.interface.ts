import { IApiStashTabSnapshot } from './api-stash-tab-snapshot.interface';
import { Moment } from 'moment';

export interface IApiSnapshot {
  uuid: string;
  datestamp: Moment;
  stashTabs: IApiStashTabSnapshot[];
}
