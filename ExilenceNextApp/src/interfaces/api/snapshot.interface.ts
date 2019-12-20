import { IApiStashTabSnapshot } from './stash-tab-snapshot.interface';
import { Moment } from 'moment';

export interface IApiSnapshot {
  uuid: string;
  datestamp: Moment;
  stashTabs: IApiStashTabSnapshot[];
}
