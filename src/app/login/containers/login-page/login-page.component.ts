import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import * as applicationActions from './../../../store/application/application.actions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router, private appStore: Store<ApplicationSession>) { }

  ngOnInit() {
  }

  login(event: ApplicationSession) {

    this.appStore.dispatch(new applicationActions.SetLeague({
      league: event.league
    }));

    this.appStore.dispatch(new applicationActions.SetTradeLeague({
      tradeLeague: event.tradeLeague
    }));

    this.router.navigate(['/auth/net-worth']);
  }

  validate(event: ApplicationSessionDetails) {
    this.appStore.dispatch(new applicationActions.InitSession({
      accountDetails: event
    }));
  }
}
