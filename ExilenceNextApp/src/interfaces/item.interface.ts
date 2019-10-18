import { IProperty } from './property.interface';
import { IRequirement } from './requirement.interface';
import { ISocket } from './socket.interface';
import { ISocketedItem } from './socketed-item.interface';

export interface IItem {
    id: string;
    verified: boolean;
    w: number;
    h: number;
    ilvl: number;
    icon: string;
    league: string;
    sockets: Array<ISocket>;
    name: string;
    shaper: boolean;
    elder: boolean;
    fractured: boolean;
    synthesised: boolean;
    typeLine: string;
    identified: boolean;
    corrupted: boolean;
    lockedToCharacter: boolean;
    requirements: Array<IRequirement>;
    implicitMods: Array<string>;
    explicitMods: Array<string>;
    fracturedMods: Array<string>;
    frameType: number;
    x: number;
    y: number;
    inventoryId: string;
    socketedItems: Array<ISocketedItem>;
    properties: Array<IProperty>;
    flavourText: Array<string>;
    craftedMods: Array<string>;
    enchantMods: Array<string>;
    utilityMods: Array<string>;
    descrText: string;
    prophecyText: string;
    socket: number;
    stackSize?: number;
    maxStackSize?: number;
}

