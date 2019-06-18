import { Injectable } from '@angular/core';
import { TabSnapshotsState } from '../../../app.states';
import { Store } from '@ngrx/store';
import { ApplicationStatus } from '../../../shared/interfaces/application-status.interface';

@Injectable()
export class SnapshotService {

  constructor(
    private tabSnapshotStore: Store<TabSnapshotsState>,
    private appStatusStore: Store<ApplicationStatus>
  ) {
  }

  snapshot() {
    // todo: snapshot based on tab-
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {

    }, 1000 * 5);
  }
}
