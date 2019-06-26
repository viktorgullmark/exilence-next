import { PoeWatchCategoryGroup } from './poe-watch-category-group.interface';

export interface PoeWatchCategory {
    id: number;
    name: string;
    display: string;
    groups: PoeWatchCategoryGroup[];
}