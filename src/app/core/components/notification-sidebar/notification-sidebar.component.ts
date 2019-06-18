import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-notification-sidebar',
  templateUrl: './notification-sidebar.component.html',
  styleUrls: ['./notification-sidebar.component.scss']
})
export class NotificationSidebarComponent implements OnInit {

  @ViewChild('sidenav', undefined) sidenav: MatSidenav;

  constructor() {
  }

  ngOnInit() {
  }

  toggle() {
    this.sidenav.toggle();
  }
}
