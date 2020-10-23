import { IApiProfile } from './api-profile.interface';

export interface IApiAccount {
  uuid: string;
  name: string;
  accessToken: string;
  verified: boolean;
  role: RoleEnum;
  profiles: IApiProfile[];
}

export enum RoleEnum {
  User = 0,
  Premium = 5,
  Admin = 10,
}
