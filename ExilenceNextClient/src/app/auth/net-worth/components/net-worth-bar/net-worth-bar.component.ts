import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-net-worth-bar',
  templateUrl: './net-worth-bar.component.html',
  styleUrls: ['./net-worth-bar.component.scss']
})
export class NetWorthBarComponent implements OnInit {

  @Output() tabSelectionChanged: EventEmitter<string[]> = new EventEmitter;

  constructor() { }

  ngOnInit() {
  }
  
  tabsChanged(tabs: string[]) {
    this.tabSelectionChanged.emit(tabs);
  }

}
