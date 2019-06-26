import { Injectable } from '@angular/core';
import { ElectronService } from './electron.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsState } from './../../app.states';
import { Notification } from './../../shared/interfaces/notification.interface';
import * as notificationActions from './../../store/notification/notification.actions';
import { NotificationType } from '../../shared/enums/notification-type.enum';
import { Guid } from 'guid-typescript';
import { Store } from '@ngrx/store';

@Injectable()
export class CookieService {

    constructor(
        private electronService: ElectronService,
        private translateService: TranslateService,
        private notificationStore: Store<NotificationsState>
    ) { }

    setSessionCookie(sessionId: string) {

        this.electronService.remote.session.defaultSession.cookies.remove('http://www.pathofexile.com', 'POESESSID', (error) => {});

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
        });
    }
}
