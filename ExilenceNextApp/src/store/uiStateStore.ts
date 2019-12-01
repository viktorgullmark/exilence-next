import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';
import { CookieHelper } from './../helpers/cookie.helper';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Notification } from './domains/notification';

export class UiStateStore {
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist @observable sidenavOpen: boolean = false;
  @observable validated: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable itemTablePageIndex: number = 0;
  @observable alertOpen: boolean = false;
  @observable alertNotification: Notification | undefined = undefined;
  
  @action
  setSessIdCookie(sessionId: string) {
    const cookie = CookieHelper.constructCookie(sessionId);
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
  openAlert(notification: Notification) {
    this.alertNotification = notification;
    this.alertOpen = true;
  }

  @action
  closeAlert() {
    this.alertOpen = false;
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
