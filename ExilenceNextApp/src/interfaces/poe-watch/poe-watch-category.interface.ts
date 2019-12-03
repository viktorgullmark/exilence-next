import { IPoeWatchCategoryGroup } from './poe-watch-category-group.interface';

export interface IPoeWatchCategory {
  id: number;
  name: string;
  display: string;
  groups: IPoeWatchCategoryGroup[];
}
