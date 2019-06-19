import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable()
export class SettingsService {

    constructor(private electronService: ElectronService) { }

    setKey(key: string, object: any) {
        this.electronService.settings.set(key, object);
    }

    get(key: string) {
        return this.electronService.settings.get(key);
    }

    clearSettings() {
        this.electronService.settings.deleteAll();
    }
}
