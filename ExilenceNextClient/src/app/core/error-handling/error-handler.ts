import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { HttpError } from '../../shared/interfaces/http-error.interface';
import { ParsedUrl } from '../../shared/interfaces/parsed-url.interface';

@Injectable()
export class ErrorHandler {
    constructor(
        public snackbar: MatSnackBar,
        private translateService: TranslateService
    ) { }

  public handleError(err: HttpError) {
    switch (err.status) {

      case 0: {
        err.message = this.translateService.instant('ERROR.UNREACHABLE') + this.parseUrl(err.url).origin;
        break;
      }

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


  private parseUrl(url: string): ParsedUrl {
    const a = document.createElement('a');
    a.setAttribute('href', url);
    const { host, hostname, pathname, port, protocol, search, hash } = a;
    const origin = `${protocol}//${hostname}${port.length ? `:${port}` : ''}`;
    return { origin, host, hostname, pathname, port, protocol, search, hash };
  }
}
