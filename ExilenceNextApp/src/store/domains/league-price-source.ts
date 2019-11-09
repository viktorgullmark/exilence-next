import { persist } from 'mobx-persist';
import uuid from 'uuid';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { ILeaguePriceSource } from '../../interfaces/league-price-source.interface';

export class LeaguePriceSource {
  @persist uuid: string = uuid.v4();
  @persist priceSourceUuid: string = '';

  @persist('list') prices: IExternalPrice[] = [];

  constructor(obj?: ILeaguePriceSource) {
    Object.assign(this, obj);
  }
}
