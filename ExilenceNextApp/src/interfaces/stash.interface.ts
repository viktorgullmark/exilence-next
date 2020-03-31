import { IItem } from './item.interface';

export interface IStash {
  numTabs: number;
  tabs: IStashTab[];
  items: IItem[];
  mapLayout: any;
  [x: string]: any;
}

export interface IStashTab {
  n: string;
  i: number;
  id: string;
  type: string;
  hidden: boolean;
  selected: boolean;
  colour: IColour;
  srcL: string;
  srcC: string;
  srcR: string;
}

export interface ICompactTab {
  n: string;
  i: number;
  id: string;
  colour: IColour;
}

export interface IColour {
  r: number;
  g: number;
  b: number;
}