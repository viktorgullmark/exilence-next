import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    // create variables for each lazyloaded module here
    public netWorthLoaded = false;

    constructor() {
    }
}
