import { Property } from './property.interface';
import { Requirement } from './requirement.interface';
import { Socket } from './socket.interface';
import { SocketedItem } from './socketed-item.interface';

export interface Item {
    id: string;
    verified: boolean;
    w: number;
    h: number;
    ilvl: number;
    icon: string;
    league: string;
    sockets: Array<Socket>;
    name: string;
    shaper: boolean;
    elder: boolean;
    fractured: boolean;
    synthesised: boolean;
    typeLine: string;
    identified: boolean;
    corrupted: boolean;
    lockedToCharacter: boolean;
    requirements: Array<Requirement>;
    implicitMods: Array<string>;
    explicitMods: Array<string>;
    fracturedMods: Array<string>;
    frameType: number;
    x: number;
    y: number;
    inventoryId: string;
    socketedItems: Array<SocketedItem>;
    properties: Array<Property>;
    flavourText: Array<string>;
    craftedMods: Array<string>;
    enchantMods: Array<string>;
    utilityMods: Array<string>;
    descrText: string;
    prophecyText: string;
    socket: number;
    stackSize?: number;
}

