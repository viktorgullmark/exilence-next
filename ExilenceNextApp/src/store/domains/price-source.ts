import { persist } from 'mobx-persist';
import { v4 as uuidv4 } from 'uuid';

import { IPriceSource } from '../../interfaces/price-source.interface';

export class PriceSource implements IPriceSource {
  @persist uuid: string = uuidv4();
  @persist name: string = '';
  @persist url: string = '';

  constructor(obj?: IPriceSource) {
    Object.assign(this, obj);
  }
}
