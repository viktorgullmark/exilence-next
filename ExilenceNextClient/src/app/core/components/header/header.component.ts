import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { version } from '../../../../../package.json';
import { ElectronService } from '../../providers/electron.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Notification } from '../../../shared/interfaces/notification.interface';
import { Observable } from 'rxjs';
import * as notificationReducer from './../../../store/notification/notification.reducer';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public appVersion: string = version;
  public isMaximized = false;
  public isToggled = false;

  public notifications$: Observable<Notification[]>;

  @Output() toggled: EventEmitter<any> = new EventEmitter;

  constructor(
    public electronService: ElectronService,
    private router: Router,
    private notificationStore: Store<Notification>
    ) {
      this.notifications$ = this.notificationStore.select(notificationReducer.selectAllNotifications);
  }

  ngOnInit() {
  }

  minimize() {
    this.electronService.remote.getCurrentWindow().minimize();
  }

  maximize() {
    this.isMaximized = true;
    this.electronService.remote.getCurrentWindow().maximize();
  }

  unmaximize() {
    this.isMaximized = false;
    this.electronService.remote.getCurrentWindow().unmaximize();
  }

  close() {
    this.electronService.remote.getCurrentWindow().close();
  }

  logout() {
    this.router.navigate(['/']);
  }

  toggleSidenav() {
    this.toggled.emit();
    this.isToggled = !this.isToggled;
  }
}
