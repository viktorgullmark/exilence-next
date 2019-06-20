import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import * as applicationActions from './../../../store/application/application.actions';
import { League } from '../../../shared/interfaces/league.interface';
import { Store } from '@ngrx/store';
import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
  public accountFormGroup: FormGroup;
  public leagueFormGroup: FormGroup;
  public charFormGroup: FormGroup;

  // todo: remove mock data
  public leagues: Array<League> = [{ id: 'Exilence Legion (PL4896)', description: '' } as League];
  public tradeLeagues: Array<League> = [{ id: 'Exilence Legion (PL4896)', description: '' } as League];

  @ViewChild('stepper', undefined) stepper: MatStepper;
  @Output() formData: EventEmitter<ApplicationSession> = new EventEmitter;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
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
  }

  ngOnInit() {
  }

  mapTradeLeague(event: any) {
    console.log(event);
  }

  validate(accountName: string, sessionId: string) {
    this.appStore.dispatch(new applicationActions.InitSession({
      accountDetails: { account: accountName, sessionId: sessionId } as ApplicationSessionDetails
    }));
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
