import { ICategory } from './category.interface';
import { IProperty } from './property.interface';
import { IRequirement } from './requirement.interface';

export interface ISocketedItem {
  id: string;
  verified: boolean;
  w: number;
  h: number;
  ilvl: number;
  icon: string;
  name: string;
  typeLine: string;
  corrupted: boolean;
  lockedToCharacter: boolean;
  category: ICategory;
  requirements: Array<IRequirement>;
  nextLevelRequirements: Array<IRequirement>;
  explicitMods: Array<string>;
  frameType: number;
  x: number;
  y: number;
  properties: Array<IProperty>;
  additionalProperties: Array<IProperty>;
  descrText: string;
  secDescrText: string;
  socket: number;
}
