import { action, makeObservable, observable } from 'mobx';
import { electronService } from '../services/electron.service';
import { RootStore } from './rootStore.js';

export class LogStore {
  @observable event: any = null;
  @observable running: boolean = false;

  constructor(private rootStore: RootStore) {
    makeObservable(this);
    electronService.ipcRenderer.on('log-event', (_event: any, args: any) => {
      switch (args.event) {
        case 'start':
          this.running = true;
          this.rootStore.notificationStore.createNotification('log_monitor_started', 'success');
          break;
        case 'stop':
          this.running = false;
          this.rootStore.notificationStore.createNotification('log_monitor_stopped', 'success');
          break;
      }
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
