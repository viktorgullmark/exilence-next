import { action, observable } from 'mobx';
import * as pkg from '../../package.json';
import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore.js';

export class LogStore {
  @observable currentVersion: string = pkg['version'];
  @observable updateAvailable: boolean = false;

  constructor(private rootStore: RootStore) {
    electronService.ipcRenderer.on('log-event', (event: any, args: any) => {
      console.log('args: ', args);
    });
  }

  @action
  createLogMonitor() {
    electronService.ipcRenderer.send('log-create');
  }

  @action
  startLogMonitor() {
    electronService.ipcRenderer.send('log-start');
  }

  @action
  stopLogMonitor() {
    electronService.ipcRenderer.send('log-stop');
  }

  @action
  setLogMonitorPath(path: string) {
    electronService.ipcRenderer.send('log-path', { path });
  }
}
