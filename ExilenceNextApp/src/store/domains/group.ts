import uuid from 'uuid';
import { IGroup } from '../../interfaces/group.interface';
import { IConnection } from '../../interfaces/connection.interface';

export class Group implements IGroup {
    uuid: string = uuid.v4();
    name: string = '';
    created: Date = new Date();
    connections: IConnection[] = [];

    constructor(obj?: IGroup) {
        Object.assign(this, obj);
    }
  }