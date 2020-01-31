import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IPriceSource } from '../../interfaces/price-source.interface';

export class PriceSource implements IPriceSource {
  @persist uuid: string = uuid.v4();
  @persist name: string = '';
  @persist url: string = '';

  constructor(obj?: IPriceSource) {
    Object.assign(this, obj);
  }
}
