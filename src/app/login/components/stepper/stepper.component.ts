import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { League } from '../../../shared/interfaces/league.interface';
import { Session } from '../../../shared/interfaces/session.interface';

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
  @Output() formData: EventEmitter<Session> = new EventEmitter;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
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

  authorize() {
    const session = {
      account: this.accountFormGroup.controls.accountName.value,
      sessionId: this.accountFormGroup.controls.sessionId.value,
      league: this.leagueFormGroup.controls.leagueName.value,
      tradeLeague: this.leagueFormGroup.controls.tradeLeagueName.value
    } as Session;

    this.formData.emit(session);
  }

}
