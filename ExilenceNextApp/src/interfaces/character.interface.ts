import { IItem } from './item.interface';

export interface ICharacterListResponse {
  characters: ICharacter[];
}

export interface ICharacterResponse {
  character: ICharacter;
}

export interface ICharacter {
  id: string;
  name: string;
  class: string;
  level: number;
  experience: number;
  league?: string;
  expired?: boolean;
  deleted?: boolean;
  current?: boolean;
  equipment?: IItem[];
  inventory?: IItem[];
  jewels?: IItem[];
}
