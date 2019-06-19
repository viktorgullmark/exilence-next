import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../shared/interfaces/session.interface';
import { SessionService } from '../../../core/providers/session.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private router: Router, private sessionService: SessionService) { }

  ngOnInit() {
  }

  login(event: Session) {
    this.sessionService.createSession(event);
    this.router.navigate(['/auth/net-worth']);
  }
}
