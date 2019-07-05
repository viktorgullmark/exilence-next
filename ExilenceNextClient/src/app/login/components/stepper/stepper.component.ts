import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { ApplicationEffects } from '../../../store/application/application.effects';
import * as applicationReducer from './../../../store/application/application.reducer';
import * as applicationActions from './../../../store/application/application.actions';
import { first, take } from 'rxjs/operators';
import { takeUntil } from 'rxjs-compat/operator/takeUntil';
import { selectApplicationSession } from '../../../store/application/application.selectors';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public accountFormGroup: FormGroup;
  public leagueFormGroup: FormGroup;
  public charFormGroup: FormGroup;

  @Input() leagues$: Observable<string[]>;
  @Input() tradeLeagues$: Observable<string[]>;
  @Input() loading$: Observable<Boolean>;
  @Input() validated$: Observable<Boolean>;

  @ViewChild('stepper', undefined) stepper: MatStepper;
  @Output() login: EventEmitter<ApplicationSession> = new EventEmitter;
  @Output() validate: EventEmitter<ApplicationSessionDetails> = new EventEmitter;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private applicationEffects: ApplicationEffects,
    private appStore: Store<ApplicationSession>
  ) {

    this.accountFormGroup = fb.group({
      accountName: ['', Validators.required],
      sessionId: ['', Validators.required]
    });
    this.leagueFormGroup = fb.group({
      leagueName: ['', Validators.required],
      tradeLeagueName: ['', Validators.required]
    });

    this.applicationEffects.validateSessionForLoginSuccess$
      .subscribe(() => {
        this.stepper.next();
      });
  }

  ngOnInit() {
    this.leagues$.takeUntil(this.destroy$).subscribe(leagues => {
      this.leagueFormGroup.controls['leagueName'].setValue(leagues[0]);
    });
    this.tradeLeagues$.takeUntil(this.destroy$).subscribe(leagues => {
      this.leagueFormGroup.controls['tradeLeagueName'].setValue(leagues[0]);
    });

    this.appStore.select(selectApplicationSession).takeUntil(this.destroy$)
      .subscribe((data: ApplicationSessionDetails) => {
        if (data !== undefined) {
          this.accountFormGroup.controls.accountName.setValue(data.account);
          this.accountFormGroup.controls.sessionId.setValue(data.sessionId);
        }
      });
  }

  mapTradeLeague(event: any) {
    console.log(event);
  }

  doValidate(accountName: string, sessionId: string) {
    this.validate.emit({ account: accountName, sessionId: sessionId } as ApplicationSessionDetails);
  }

  doLogin() {
    const session = {
      account: this.accountFormGroup.controls.accountName.value,
      sessionId: this.accountFormGroup.controls.sessionId.value,
      league: this.leagueFormGroup.controls.leagueName.value,
      tradeLeague: this.leagueFormGroup.controls.tradeLeagueName.value
    } as ApplicationSession;

    this.login.emit(session);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
