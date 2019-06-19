import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { Guid } from 'guid-typescript';
import { Notification } from './../../shared/interfaces/notification.interface';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './notification.service';

@Injectable()
export class CookieService {

    constructor(
        private electronService: ElectronService,
        private translateService: TranslateService,
        private notificationService: NotificationService
    ) { }

    setSessionCookie(sessionId: string) {
        const cookie = {
            url: 'http://www.pathofexile.com',
            name: 'POESESSID',
            value: sessionId,
            domain: '.pathofexile.com',
            path: '/',
            secure: false,
            httpOnly: false,
            expirationDate: undefined
        } as Electron.Details;

        this.electronService.remote.session.defaultSession.cookies.set(cookie, (error) => {
            this.translateService.get([
                'ERROR.COOKIE_NOT_SET_TITLE',
                'ERROR.COOKIE_NOT_SET_DESC',
                'INFORMATION.COOKIE_SET_TITLE',
                'INFORMATION.COOKIE_SET_DESC'
            ]).subscribe(translations => {
                if (error) {
                    this.notificationService.addNotification(translations['ERROR.COOKIE_NOT_SET_TITLE'],
                        translations['ERROR.COOKIE_NOT_SET_DESC'],
                        NotificationType.Information);
                } else {
                    this.notificationService.addNotification(translations['INFORMATION.COOKIE_SET_TITLE'],
                        translations['INFORMATION.COOKIE_SET_DESC'],
                        NotificationType.Information);
                }
            });
        });
    }
}
