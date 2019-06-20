import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';

@Injectable()
export class StorageService {

    constructor(private electronService: ElectronService) { }

    setKey(key: string, object: any) {
        this.electronService.storage.set(key, object);
    }

    get(key: string) {
        return this.electronService.storage.get(key);
    }

    clearStorage() {
        this.electronService.storage.deleteAll();
    }
}
