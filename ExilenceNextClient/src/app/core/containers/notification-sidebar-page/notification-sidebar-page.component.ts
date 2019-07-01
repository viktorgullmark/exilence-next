import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Store } from '@ngrx/store';
import { NotificationsState } from '../../../app.states';
import { Observable, Subject } from 'rxjs';
import * as notificationReducer from './../../../store/notification/notification.reducer';
import { Notification } from './../../../shared/interfaces/notification.interface';
import { filter, switchMap, distinctUntilChanged, map } from 'rxjs/operators';
import 'rxjs/add/operator/takeUntil';
import { selectAllNotifications } from '../../../store/notification/notification.selectors';

@Component({
  selector: 'app-notification-sidebar-page',
  templateUrl: './notification-sidebar-page.component.html',
  styleUrls: ['./notification-sidebar-page.component.scss']
})
export class NotificationSidebarPageComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  public notifications$: Observable<Notification[]>;

  @ViewChild('sidenav', undefined) sidenav: MatSidenav;

  constructor(private notificationStore: Store<NotificationsState>) {
    this.notifications$ = this.notificationStore.select(selectAllNotifications).takeUntil(this.destroy$).pipe(
      // only update notifications when the count changes
      distinctUntilChanged((prev, curr) => prev.length === curr.length)
    );
  }

  ngOnInit() {
  }

  toggle() {
    this.sidenav.toggle();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
