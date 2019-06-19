import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';

import { Character } from '../../../shared/interfaces/character.interface';
import { League } from '../../../shared/interfaces/league.interface';
import { SessionForm } from '../../../shared/interfaces/session-form.interface';

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
  public characters: Array<Character> = [{
    name: 'test_char',
    league: 'Exilence Legion (PL4896)',
    classId: 1,
    ascendancyClass: 1,
    class: 'Witch',
    level: 1
  } as Character];

  @ViewChild('stepper', undefined) stepper: MatStepper;
  @Output() formData: EventEmitter<SessionForm> = new EventEmitter;

  constructor(@Inject(FormBuilder) fb: FormBuilder) {
    this.accountFormGroup = fb.group({
      accountName: ['', Validators.required],
      sessionId: ['', Validators.required]
    });
    this.leagueFormGroup = fb.group({
      leagueName: ['', Validators.required],
      tradeLeagueName: ['', Validators.required]
    });
    this.charFormGroup = fb.group({
      characterName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  mapTradeLeague(event: any) {
    console.log(event);
  }

  fetchCharacters() {
    this.stepper.next();
  }

  authorize() {
    const formData = {
      accountName: this.accountFormGroup.controls.accountName.value,
      sessionId: this.accountFormGroup.controls.sessionId.value,
      leagueName: this.leagueFormGroup.controls.leagueName.value,
      tradeLeagueName: this.leagueFormGroup.controls.tradeLeagueName.value,
      characterName: this.charFormGroup.controls.characterName.value
    } as SessionForm;

    this.formData.emit(formData);
  }

}
