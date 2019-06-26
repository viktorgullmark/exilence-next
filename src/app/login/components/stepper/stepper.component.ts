import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { ApplicationEffects } from '../../../store/application/application.effects';
import * as applicationReducer from './../../../store/application/application.reducer';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  public accountFormGroup: FormGroup;
  public leagueFormGroup: FormGroup;
  public charFormGroup: FormGroup;

  public leagues$: Observable<string[]>;
  public tradeLeagues$: Observable<string[]>;
  public loading$: Observable<Boolean>;
  public validated$: Observable<Boolean>;

  @ViewChild('stepper', undefined) stepper: MatStepper;
  @Output() formData: EventEmitter<ApplicationSession> = new EventEmitter;
  @Output() validateSession: EventEmitter<ApplicationSessionDetails> = new EventEmitter;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private appStore: Store<ApplicationSession>,
    private applicationEffects: ApplicationEffects
  ) {

    this.leagues$ = this.appStore.select(applicationReducer.selectApplicationSessionLeagues);
    this.tradeLeagues$ = this.appStore.select(applicationReducer.selectApplicationSessionLeagues);
    this.loading$ = this.appStore.select(applicationReducer.selectApplicationSessionLoading);
    this.validated$ = this.appStore.select(applicationReducer.selectApplicationSessionValidated);

    this.applicationEffects.validateSessionSuccess$
        .subscribe(() => this.stepper.next());

    this.accountFormGroup = fb.group({
      accountName: ['', Validators.required],
      sessionId: ['', Validators.required]
    });
    this.leagueFormGroup = fb.group({
      leagueName: ['', Validators.required],
      tradeLeagueName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  mapTradeLeague(event: any) {
    console.log(event);
  }

  validate(accountName: string, sessionId: string) {
    this.validateSession.emit({ account: accountName, sessionId: sessionId } as ApplicationSessionDetails);
  }

  authorize() {
    const session = {
      account: this.accountFormGroup.controls.accountName.value,
      sessionId: this.accountFormGroup.controls.sessionId.value,
      league: this.leagueFormGroup.controls.leagueName.value,
      tradeLeague: this.leagueFormGroup.controls.tradeLeagueName.value
    } as ApplicationSession;

    this.formData.emit(session);
  }

}
