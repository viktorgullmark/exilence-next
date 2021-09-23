import { IItem } from './item.interface';

export interface IStash {
  stashes: IStashTab[];
}

export interface IStashTabResponse {
  stash: IStashTab;
}

export interface IStashTab {
  id: string;
  index: number;
  name: string;
  type: string;
  metadata: IMetaData;
  items?: IItem[];
  public?: boolean;
  folder?: boolean;
  parent?: string;
  children?: IStashTab[];
}

export interface ICompactTab {
  id: string;
  name: string;
  index: number;
  color: string;
}

export interface IMetaData {
  colour: string;
}
