import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { version } from '../../../../../package.json';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public appVersion: string = version;
  public isMaximized = false;
  public isToggled = false;

  @Output() toggled: EventEmitter<any> = new EventEmitter;

  constructor(public electronService: ElectronService) {
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

  toggleSidenav() {
    this.toggled.emit();
    this.isToggled = !this.isToggled;
  }
}
