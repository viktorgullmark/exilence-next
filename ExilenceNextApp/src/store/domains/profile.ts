import { persist } from 'mobx-persist';
import uuid from 'uuid';

export class Profile {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
}
