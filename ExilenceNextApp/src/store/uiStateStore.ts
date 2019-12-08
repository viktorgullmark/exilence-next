import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';
import { CookieUtils } from '../utils/cookie.utils';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Notification } from './domains/notification';

export class UiStateStore {
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist @observable sidenavOpen: boolean = false;
  @observable validated: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable itemTablePageIndex: number = 0;
  @observable notificationListAnchor: null | HTMLElement = null;
  @observable notificationList: Notification[] = [];

  @action
  setNotificationList(list: Notification[]) {
    this.notificationList = list;
  }

  @action
  setNotificationListAnchor(el: HTMLElement | null) {
    this.notificationListAnchor = el;
  }

  @action
  setSessIdCookie(sessionId: string) {
    const cookie = CookieUtils.constructCookie(sessionId);
    return authService.setAuthCookie(cookie).pipe(
      map(() => {
        return runInAction(() => {
          this.sessIdCookie = cookie;
        });
      })
    );
  }

  @action
  changeItemTablePage(index: number) {
    this.itemTablePageIndex = index;
  }

  @action
  toggleSidenav(open?: boolean) {
    this.sidenavOpen = open || !this.sidenavOpen;
  }

  @action
  setValidated(validated: boolean) {
    this.validated = validated;
  }

  @action
  setSubmitting(submitting: boolean) {
    this.isSubmitting = submitting;
  }
}
