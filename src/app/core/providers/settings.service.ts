import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable()
export class SettingsService {

    constructor(private electronService: ElectronService) { }

    setKey(key: string, object: any) {
        if (this.electronService.isElectron()) {
            this.electronService.settings.set(key, object);
        } else {
            localStorage.setItem(key, JSON.stringify(object));
        }
    }

    get(key: string) {
        if (this.electronService.isElectron()) {
            return this.electronService.settings.get(key);
        } else {
            return JSON.parse(localStorage.getItem(key));
        }
    }

    clearSettings() {
        if (this.electronService.isElectron()) {
            this.electronService.settings.deleteAll();
        } else {
            localStorage.clear();
        }
    }
}
