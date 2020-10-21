import { IProfile } from './profile.interface';

export interface IAccountAuth {
  uuid: string;
  name: string;
  accessToken: string;
  profiles: IProfile[];
}
