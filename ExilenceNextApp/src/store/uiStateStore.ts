import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';
import { CookieUtils } from '../utils/cookie.utils';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Notification } from './domains/notification';
import uuid from 'uuid';

export type GroupDialogType = 'create' | 'join' | undefined;

export class UiStateStore {
  @observable @persist userId: string = uuid.v4();
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist @observable sidenavOpen: boolean = false;
  @observable validated: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable itemTablePageIndex: number = 0;
  @observable notificationListAnchor: null | HTMLElement = null;
  @observable accountMenuAnchor: null | HTMLElement = null;
  @observable notificationList: Notification[] = [];
  @observable initated: boolean = false;
  @observable itemTableFilterText: string = '';
  @observable isInitiating: boolean = false;
  @observable groupDialogOpen: boolean = false;
  @observable groupDialogType: 'create' | 'join' | undefined = undefined;
  @observable groupOverviewOpen: boolean = false;
  @observable groupExists: boolean | undefined = undefined;

  @action
  setGroupExists(exists: boolean) {
    this.groupExists = exists;
  }

  @action
  setNotificationList(list: Notification[]) {
    this.notificationList = list;
  }

  @action
  setNotificationListAnchor(el: HTMLElement | null) {
    this.notificationListAnchor = el;
  }

  @action
  setAccountMenuAnchor(el: HTMLElement | null) {
    this.accountMenuAnchor = el;
  }

  @action
  setGroupDialogOpen(open: boolean, type?: GroupDialogType) {
    this.groupDialogType = type;
    this.groupDialogOpen = open;
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
    this.groupOverviewOpen = false;
    this.sidenavOpen = open || !this.sidenavOpen;
  }

  @action
  toggleGroupOverview(open?: boolean) {
    this.sidenavOpen = false;
    this.groupOverviewOpen = open || !this.groupOverviewOpen;
  }

  @action
  setValidated(validated: boolean) {
    this.validated = validated;
  }

  @action
  setItemTableFilterText(text: string) {
    this.itemTableFilterText = text;
  }

  @action
  setInitiated(init: boolean) {
    this.initated = init;
  }

  @action
  setSubmitting(submitting: boolean) {
    this.isSubmitting = submitting;
  }

  @action
  setIsInitiating(initiating: boolean) {
    this.isInitiating = initiating;
  }
}
