import { NetWorthItem } from './net-worth-item.interface';
import { Guid } from 'guid-typescript';

export interface TabSnapshot {
    id: Guid;
    tabId: string;
    value: number;
    timestamp: Date;
    items: Array<NetWorthItem>;
}
