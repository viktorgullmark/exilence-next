import { ISelectOption } from '../interfaces/select-option.interface';
import uuid from 'uuid';

export function getPriceTresholdOptions() {
  return <ISelectOption[]>[
    {
      id: uuid.v4(),
      value: 1
    },
    {
      id: uuid.v4(),
      value: 5
    },
    {
      id: uuid.v4(),
      value: 10
    }
  ];
}
