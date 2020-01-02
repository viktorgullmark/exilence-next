import { IApiStashTabSnapshot } from './api-stash-tab-snapshot.interface';
import { Moment } from 'moment';
import { IApiProfile } from './api-profile.interface';

export interface IApiSnapshot {
  uuid: string;
  datestamp: Moment;
  stashTabs: IApiStashTabSnapshot[];
  profile: IApiProfile;
}
