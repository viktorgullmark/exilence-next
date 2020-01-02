import uuid from 'uuid';
import { IApiGroup } from '../../interfaces/api/api-group.interface';
import { IApiConnection } from '../../interfaces/api/api-connection.interface';

export class Group implements IApiGroup {
    uuid: string = uuid.v4();
    name: string = '';
    created: Date = new Date();
    connections: IApiConnection[] = [];

    constructor(obj?: IApiGroup) {
        Object.assign(this, obj);
    }
  }