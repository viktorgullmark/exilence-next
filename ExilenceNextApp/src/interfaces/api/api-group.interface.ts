import { IApiConnection } from './api-connection.interface';

export interface IApiGroup {
  name: string;
  connections: IApiConnection[];
  created: Date;
}
