import { Injectable } from '@angular/core';
import { TabSnapshotsState } from '../../../app.states';
import { Store } from '@ngrx/store';
import { Application } from '../../../shared/interfaces/application.interface';
import { ExternalService } from '../../../core/providers/external.service';
import { SessionService } from '../../../core/providers/session.service';
import { SessionForm } from '../../../shared/interfaces/session-form.interface';
import { Stash } from '../../../shared/interfaces/stash.interface';

@Injectable()
export class SnapshotService {

  constructor(
    private tabSnapshotStore: Store<TabSnapshotsState>,
    private appStore: Store<Application>,
    private sessionService: SessionService,
    private externalService: ExternalService
  ) {
    this.checkIfReady();
  }

  snapshot() {
    // todo: snapshot based on max-tabs, up to 60~

    const session: SessionForm = this.sessionService.getSession();

    this.externalService.getStashTabs(session.accountName, session.leagueName).subscribe((res: Stash) => {
      console.log(res);
    });
  }

  checkIfReady() {
    // check if ready to begin snapshotting
    setInterval(() => {
      this.snapshot();
    }, 1000 * 5);
  }
}
