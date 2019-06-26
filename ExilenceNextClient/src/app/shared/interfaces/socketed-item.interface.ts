import { Category } from './category.interface';
import { Property } from './property.interface';
import { Requirement } from './requirement.interface';

export interface SocketedItem {
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
    category: Category;
    requirements: Array<Requirement>;
    nextLevelRequirements: Array<Requirement>;
    explicitMods: Array<string>;
    frameType: number;
    x: number;
    y: number;
    properties: Array<Property>;
    additionalProperties: Array<Property>;
    descrText: string;
    secDescrText: string;
    socket: number;
}
