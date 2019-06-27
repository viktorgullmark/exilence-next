import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ErrorHandler {
    constructor(
        public snackbar: MatSnackBar,
        private translateService: TranslateService
    ) { }

    public handleError(err: any) {
        switch (err.status) {
            case 403: {
                err.message = this.translateService.instant('ERROR.UNAUTHORIZED');
                break;
            }

            case 404: {
                err.message = this.translateService.instant('ERROR.NOT_FOUND');
                break;
            }

            default: {
                break;
            }
        }

        this.snackbar.open(err.message, 'close');
    }
}
