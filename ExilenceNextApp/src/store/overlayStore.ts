import { action } from 'mobx';
import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore.js';

export class OverlayStore {
  constructor(private rootStore: RootStore) {}

  @action
  createOverlay(data: any) {
    electronService.ipcRenderer.send('createOverlay', data);
  }

  @action
  updateOverlay(data: any) {
    electronService.ipcRenderer.send('overlayUpdate', data);
  }
}
