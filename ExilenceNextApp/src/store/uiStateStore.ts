import { action, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';
import { CookieUtils } from '../utils/cookie.utils';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Notification } from './domains/notification';
import uuid from 'uuid';
import { AxiosError } from 'axios';

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
  @observable initiated: boolean = false;
  @observable itemTableFilterText: string = '';
  @observable isInitiating: boolean = false;
  @observable groupDialogOpen: boolean = false;
  @observable groupDialogType: 'create' | 'join' | undefined = undefined;
  @observable groupOverviewOpen: boolean = false;
  @observable groupExists: boolean | undefined = undefined;
  @observable groupError: AxiosError | Error | undefined = undefined;
  @observable redirectedTo: string | undefined = undefined;
  @observable confirmClearSnapshotsDialogOpen: boolean = false;
  @observable confirmRemoveProfileDialogOpen: boolean = false;
  @observable isSnapshotting: boolean = false;
  @observable savingProfile: boolean = false;
  @observable removingProfile: boolean = false;
  @observable joiningGroup: boolean = false;
  @observable creatingGroup: boolean = false;
  @observable leavingGroup: boolean = false;
  @observable clearingSnapshots: boolean = false;
  @observable profilesLoaded: boolean = false;
  @observable changingProfile: boolean = false;

  @action
  setChangingProfile(changing: boolean) {
    this.changingProfile = changing;
  }

  @action
  setSavingProfile(saving: boolean) {
    this.savingProfile = saving;
  }

  @action
  setProfilesLoaded(loaded: boolean) {
    this.profilesLoaded = loaded;
  }

  @action
  setRemovingProfile(removing: boolean) {
    this.removingProfile = removing;
  }

  @action
  setJoiningGroup(joining: boolean) {
    this.joiningGroup = joining;
  }

  @action
  setCreatingGroup(creating: boolean) {
    this.creatingGroup = creating;
  }
  
  @action
  setLeavingGroup(leaving: boolean) {
    this.leavingGroup = leaving;
  }

  @action
  setClearingSnapshots(clearing: boolean) {
    this.clearingSnapshots = clearing;
  }

  @action
  setConfirmClearSnapshotsDialogOpen(open: boolean) {
    this.confirmClearSnapshotsDialogOpen = open;
  } 

  @action
  setConfirmRemoveProfileDialogOpen(open: boolean) {
    this.confirmRemoveProfileDialogOpen = open;
  }

  @action
  setGroupExists(exists: boolean) {
    this.groupExists = exists;
  }

  @action
  redirect(path: string) {
    this.redirectedTo = undefined;
    this.redirectedTo = path;
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
    if (open) {
      this.groupDialogType = type;
    }
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
  setIsSnapshotting(snapshotting: boolean = true) {
    this.isSnapshotting = snapshotting;
  }

  @action
  getSessIdCookie() {
    return authService.getAuthCookie();
  }

  @action
  changeItemTablePage(index: number) {
    this.itemTablePageIndex = index;
  }

  @action
  toggleSidenav(open?: boolean) {
    this.groupOverviewOpen = false;
    this.sidenavOpen = open !== undefined ? open : !this.sidenavOpen;
  }

  @action
  toggleGroupOverview(open?: boolean) {
    this.sidenavOpen = false;
    this.groupOverviewOpen = open !== undefined ? open : !this.groupOverviewOpen;
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
    this.initiated = init;
  }

  @action
  setSubmitting(submitting: boolean) {
    this.isSubmitting = submitting;
  }

  @action
  setIsInitiating(initiating: boolean) {
    this.isInitiating = initiating;
  }

  @action
  setGroupError(error: AxiosError | Error | undefined) {
    this.groupError = error;
  }
}
