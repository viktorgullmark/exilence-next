import { ITabSelection } from '../tab-selection.interface';

export interface INetWorthSettings {
    selectedTabs: Array<ITabSelection>;
    automaticSnapshotting: boolean;
}
