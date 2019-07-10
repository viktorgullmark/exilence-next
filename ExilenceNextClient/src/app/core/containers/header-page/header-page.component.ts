import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { version } from '../../../../../package.json';
import { Notification } from '../../../shared/interfaces/notification.interface';
import { ElectronService } from '../../providers/electron.service';
import * as notificationActions from '../../../store/notification/notification.actions';
import * as notificationReducer from '../../../store/notification/notification.reducer';
import 'rxjs/add/operator/takeUntil';
import { StorageMap } from '@ngx-pwa/local-storage';
import { selectAllNewErrorNotifications } from '../../../store/notification/notification.selectors.js';
import { NetWorthState } from '../../../app.states.js';
import { selectNetWorthStatus } from '../../../store/net-worth/net-worth.selectors.js';
import { NetWorthStatus } from '../../../shared/interfaces/net-worth-status.interface.js';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrls: ['./header-page.component.scss']
})
export class HeaderPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public appVersion: string = version;
  public isMaximized = false;
  public notificationsIsToggled = false;
  public settingsIsToggled = false;

  public status$: Observable<NetWorthStatus>;
  public newNotifications$: Observable<Notification[]>;

  private snapshotting: boolean;

  @Output() toggledNotifications: EventEmitter<any> = new EventEmitter;
  @Output() toggledSettings: EventEmitter<any> = new EventEmitter;

  constructor(
    public electronService: ElectronService,
    private router: Router,
    private notificationStore: Store<Notification>,
    private storageMap: StorageMap,
    private netWorthStore: Store<NetWorthState>,
  ) {
    this.newNotifications$ = this.notificationStore.select(selectAllNewErrorNotifications).takeUntil(this.destroy$);
    this.status$ = this.netWorthStore.select(selectNetWorthStatus).takeUntil(this.destroy$);

    this.status$.takeUntil(this.destroy$).subscribe(status => {
      this.snapshotting = status.snapshotting;
    });
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
    if (!this.snapshotting) {
      this.router.navigate(['/login']);
    }
  }

  clear() {
    this.storageMap.clear().subscribe();
  }


  toggleSettings() {
    this.toggledSettings.emit();
    this.settingsIsToggled = !this.settingsIsToggled;
  }

  toggleSidenav() {
    this.toggledNotifications.emit();
    this.notificationsIsToggled = !this.notificationsIsToggled;
    this.newNotifications$.pipe(take(1)).takeUntil(this.destroy$).subscribe(notifications => {
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

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
