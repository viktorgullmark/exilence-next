import { IApiAccount } from './api-account.interface';

export interface IApiConnection {
  connectionId: string;
  instanceName: string;
  account: IApiAccount;
  created: Date;
}
