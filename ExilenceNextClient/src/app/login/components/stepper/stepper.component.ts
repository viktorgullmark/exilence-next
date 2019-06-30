import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ApplicationSessionDetails } from '../../../shared/interfaces/application-session-details.interface';
import { ApplicationSession } from '../../../shared/interfaces/application-session.interface';
import { ApplicationEffects } from '../../../store/application/application.effects';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {
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
    private storageMap: StorageMap
  ) {

    this.accountFormGroup = fb.group({
      accountName: ['', Validators.required],
      sessionId: ['', Validators.required]
    });
    this.leagueFormGroup = fb.group({
      leagueName: ['', Validators.required],
      tradeLeagueName: ['', Validators.required]
    });

    this.applicationEffects.validateSessionSuccess$
      .subscribe(() => {
        this.stepper.next();
      });
  }

  ngOnInit() {
    this.leagues$.subscribe(leagues => {
      if (leagues !== undefined) {
        this.leagueFormGroup.controls['leagueName'].setValue(leagues[0]);
        this.leagueFormGroup.controls['tradeLeagueName'].setValue(leagues[0]);
      }
    });

    // this.storageMap.get('session.accountDetails').subscribe((data: ApplicationSessionDetails) => {
    //   if (data !== undefined) {
    //     this.accountFormGroup.controls.accountName.setValue(data.account);
    //     this.accountFormGroup.controls.sessionId.setValue(data.sessionId);
    //   }
    // });
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

}
