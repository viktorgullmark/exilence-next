import { Injectable } from '@angular/core';
import { TabSnapshotsState, ApplicationState } from '../../../app.states';
import { Store } from '@ngrx/store';
import { Application } from '../../../shared/interfaces/application.interface';
import { ExternalService } from '../../../core/providers/external.service';
import { SessionService } from '../../../core/providers/session.service';
import { SessionForm } from '../../../shared/interfaces/session-form.interface';
import { Stash } from '../../../shared/interfaces/stash.interface';
import * as appReducer from './../../../store/application/application.reducer';
import * as applicationActions from './../../../store/application/application.actions';
import { Observable } from 'rxjs';

@Injectable()
export class SnapshotService {

  private appState$: Observable<Application>;

  constructor(
    private tabSnapshotStore: Store<TabSnapshotsState>,
    private appStore: Store<Application>,
    private sessionService: SessionService,
    private externalService: ExternalService
  ) {

    this.appState$ = this.appStore.select(appReducer.selectApplication);

    this.checkIfReady();
  }

  snapshot() {
    this.setSnapshotStatus(true);
    const session: SessionForm = this.sessionService.getSession();
    this.externalService.getStashTabs(session.accountName, session.leagueName).subscribe((res: Stash) => {

    });

    setTimeout(() => {
      // temporary timeout to spoof snapshot
      this.setSnapshotStatus(false);
    }, 5 * 1000);
  }

  setSnapshotStatus(running: boolean) {
    this.appStore.dispatch(new applicationActions.UpdateSnapshotStatus({
      running: running
    }));
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {
      this.appState$.subscribe((res: Application) => {
        if (!res.snapshotting) {
          this.snapshot();
        }
      });
    }, 1000 * 1);
  }
}
