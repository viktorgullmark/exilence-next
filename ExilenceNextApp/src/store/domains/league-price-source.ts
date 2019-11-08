import uuid from 'uuid';
import { persist } from 'mobx-persist';
import { IExternalPrice } from '../../interfaces/external-price.interface';
import { observable } from 'mobx';

export class LeaguePriceSource {
    @persist uuid: string = uuid.v4();
    @persist priceSourceUuid: string = '';

    @persist('list') prices: IExternalPrice[] = [];
  }