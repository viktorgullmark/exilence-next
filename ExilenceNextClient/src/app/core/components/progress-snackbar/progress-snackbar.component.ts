import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ProgressSnackbarSnackComponent } from './progress-snackbar-snack/progress-snackbar-snack.component';

@Component({
  selector: 'app-progress-snackbar',
  templateUrl: './progress-snackbar.component.html',
  styleUrls: ['./progress-snackbar.component.scss']
})

export class ProgressSnackbarComponent {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar() {
    this._snackBar.openFromComponent(ProgressSnackbarSnackComponent, {
      horizontalPosition: 'left'
    });
  }
}
