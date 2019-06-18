import { Injectable } from '@angular/core';
import { TabSnapshotsState } from '../../../app.states';
import { Store } from '@ngrx/store';
import { Application } from '../../../shared/interfaces/application.interface';

@Injectable()
export class SnapshotService {

  constructor(
    private tabSnapshotStore: Store<TabSnapshotsState>,
    private appStore: Store<Application>
  ) {
  }

  snapshot() {
    // todo: snapshot based on tab-selection
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {

    }, 1000 * 5);
  }
}
