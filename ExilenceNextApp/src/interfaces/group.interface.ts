import { IConnection } from './connection.interface';

export interface IGroup {
    name: string;
    connections: IConnection[];
    created: Date;
}
