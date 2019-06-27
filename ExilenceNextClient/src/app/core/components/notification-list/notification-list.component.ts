import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Notification } from './../../../shared/interfaces/notification.interface';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  @Input() notifications$: Observable<Notification[]>;

  constructor() {
  }

  ngOnInit() {
  }
}
