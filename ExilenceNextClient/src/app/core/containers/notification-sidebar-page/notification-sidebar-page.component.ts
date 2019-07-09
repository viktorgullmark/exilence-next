import 'rxjs/add/operator/takeUntil';

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { NotificationsState } from '../../../app.states';
import { selectAllNotifications } from '../../../store/notification/notification.selectors';
import { Notification } from './../../../shared/interfaces/notification.interface';

@Component({
  selector: 'app-notification-sidebar-page',
  templateUrl: './notification-sidebar-page.component.html',
  styleUrls: ['./notification-sidebar-page.component.scss']
})
export class NotificationSidebarPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public notifications$: Observable<Notification[]>;
  public toggled = false;

  @ViewChild('sidenav', undefined) sidenav: MatSidenav;

  constructor(private notificationStore: Store<NotificationsState>) {
    this.notifications$ = this.notificationStore.select(selectAllNotifications).takeUntil(this.destroy$).pipe(
      // only update notifications when the count changes
      distinctUntilChanged((prev, curr) => prev.length === curr.length)
    );
  }

  ngOnInit() {
    this.sidenav.openedStart.subscribe((opened: any) => {
      this.toggled = true;
    });
    this.sidenav.openedChange.subscribe((opened: any) => {
      this.toggled = opened;
    });
  }

  toggle() {
    this.sidenav.toggle();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
