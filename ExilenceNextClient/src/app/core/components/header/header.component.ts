import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { version } from '../../../../../package.json';
import { Notification } from '../../../shared/interfaces/notification.interface';
import { ElectronService } from '../../providers/electron.service';
import * as notificationActions from './../../../store/notification/notification.actions';
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
  public newNotifications$: Observable<Notification[]>;

  @Output() toggled: EventEmitter<any> = new EventEmitter;

  constructor(
    public electronService: ElectronService,
    private router: Router,
    private notificationStore: Store<Notification>
  ) {
    this.notifications$ = this.notificationStore.select(notificationReducer.selectAllNotifications);
    this.newNotifications$ = this.notificationStore.select(notificationReducer.selectAllNewNotifications);
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
    this.newNotifications$.pipe(take(1)).subscribe(notifications => {
      const updates: Update<Notification>[] = notifications.map(n => {
        return {
          id: n.id,
          changes: {
            read: true
          }
        };
      });
      if (updates.length > 0) {
        this.notificationStore.dispatch(new notificationActions.MarkManyAsRead({ notifications: updates }));
      }
    });
  }
}
