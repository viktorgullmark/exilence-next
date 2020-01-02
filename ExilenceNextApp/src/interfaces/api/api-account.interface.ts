export interface IApiAccount {
  uuid: string;
  name: string;
  token: string;
  verified: boolean;
  role: RoleEnum;
}

export enum RoleEnum {
  User = 0,
  Premium = 5,
  Admin = 10
}
