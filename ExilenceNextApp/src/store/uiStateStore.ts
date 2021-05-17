import { AxiosError } from 'axios';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { IApiAnnouncement } from '../interfaces/api/api-announcement.interface';
import { IPricedItem } from '../interfaces/priced-item.interface';
import { ISelectOption } from '../interfaces/select-option.interface';

import { IStashTab } from '../interfaces/stash.interface';
import { IStatusMessage } from '../interfaces/status-message.interface';
import { TimespanType } from '../types/timespan.type';
import { constructCookie } from '../utils/cookie.utils';
import { ICookie } from './../interfaces/cookie.interface';
import { authService } from './../services/auth.service';
import { Notification } from './domains/notification';
import { RootStore } from './rootStore';

export type GroupDialogType = 'create' | 'join' | undefined;

const xbox: ISelectOption = {
  id: 'xbox',
  value: 'xbox',
  label: 'Xbox',
};
const pc: ISelectOption = {
  id: 'pc',
  value: 'pc',
  label: 'PC',
};
const sony: ISelectOption = {
  id: 'sony',
  value: 'sony',
  label: 'PlayStation',
};
const platforms = [pc, xbox, sony];

export class UiStateStore {
  @observable @persist userId: string = uuidv4();
  @observable sessIdCookie: ICookie | undefined = undefined;
  @persist @observable sidenavOpen: boolean = false;
  @persist @observable toolbarTourOpen: boolean = true;
  @observable validated: boolean = false;
  @observable isValidating: boolean = false;
  @observable isSubmitting: boolean = false;
  @observable itemTablePageIndex: number = 0;
  @observable notificationListAnchor: null | HTMLElement = null;
  @observable accountMenuAnchor: null | HTMLElement = null;
  @observable itemTableMenuAnchor: null | HTMLElement = null;
  @observable notificationList: Notification[] = [];
  @observable initiated: boolean = false;
  @observable itemTableFilterText: string = '';
  @observable priceTableFilterText: string = '';
  @observable isInitiating: boolean = false;
  @observable groupDialogOpen: boolean = false;
  @observable groupDialogType: 'create' | 'join' | undefined = undefined;
  @observable groupOverviewOpen: boolean = false;
  @observable groupExists: boolean | undefined = undefined;
  @observable groupError: AxiosError | Error | undefined = undefined;
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
  @observable settingsTabIndex: number = 0;
  @observable announcementDialogOpen: boolean = false;
  @observable filteredStashTabs: IStashTab[] | undefined = undefined;
  @persist @observable showItemTableFilter: boolean = false;
  @observable changingProfile: boolean = false;
  @persist @observable netWorthChartExpanded: boolean = false;
  @persist @observable tabChartExpanded: boolean = false;
  @persist @observable netWorthItemsExpanded: boolean = true;
  @observable timeSinceLastSnapshotLabel: string | undefined = undefined;
  @observable statusMessage: IStatusMessage | undefined = undefined;
  @observable loginError: string | undefined = undefined;
  @persist @observable chartTimeSpan: TimespanType = 'All time';
  @observable customPriceDialogOpen: boolean = false;
  @observable selectedPricedItem: IPricedItem | undefined = undefined;
  @observable selectedPriceTableLeagueId: string | undefined = undefined;
  @observable announcementMessage: IApiAnnouncement | undefined = undefined;
  @persist @observable selectedPlatform: ISelectOption = pc;
  @observable platformList: ISelectOption[] = platforms;
  constructor(private rootStore: RootStore) {
    makeObservable(this);
  }

  @action
  resetStatusMessage() {
    this.statusMessage = undefined;
  }

  @action.bound
  setSettingsTabIndex(index: number) {
    this.settingsTabIndex = index;
  }

  @action.bound
  setSelectedPlatform(id: string) {
    const option = this.platformList.find((p) => p.id === id);
    if (option) {
      this.selectedPlatform = option;
    }
  }

  @action
  setSelectedPriceTableLeagueId(id: string) {
    this.selectedPriceTableLeagueId = id;
  }

  @action
  setLoginError(error: string | undefined) {
    this.loginError = error;
  }

  @action
  setFilteredStashTabs(stashTabs: IStashTab[] | undefined) {
    this.filteredStashTabs = stashTabs;
  }

  @action
  setChartTimeSpan(timespan: TimespanType) {
    this.chartTimeSpan = timespan;
  }

  @action
  setStatusMessage(
    message: string,
    translateParam?: string | number,
    currentCount?: number,
    totalCount?: number
  ) {
    const statusMessage = {
      message: message,
      translateParam: translateParam,
      currentCount: currentCount,
      totalCount: totalCount,
    };

    this.statusMessage = { ...statusMessage };
  }

  @action
  setNetWorthItemsExpanded(expanded: boolean) {
    this.netWorthItemsExpanded = expanded;
  }

  @action
  setNetWorthChartExpanded(expanded: boolean) {
    this.netWorthChartExpanded = expanded;
  }

  @action
  setTabChartExpanded(expanded: boolean) {
    this.tabChartExpanded = expanded;
  }

  @action
  incrementStatusMessageCount() {
    if (
      this.statusMessage?.currentCount &&
      this.statusMessage?.totalCount &&
      this.statusMessage?.totalCount > this.statusMessage?.currentCount
    ) {
      this.statusMessage.currentCount++;
    }
  }

  @action
  setTimeSinceLastSnapshotLabel(label: string | undefined) {
    this.timeSinceLastSnapshotLabel = label;
  }

  @action
  setShowItemTableFilter(show: boolean) {
    if (!show) {
      this.setFilteredStashTabs(undefined);
    }
    this.showItemTableFilter = show;
  }

  @action
  setChangingProfile(changing: boolean) {
    this.changingProfile = changing;
  }

  @action
  setToolbarTourOpen(open: boolean) {
    this.toolbarTourOpen = open;
  }

  @action
  setAnnouncementDialogOpen(open: boolean, announcement?: IApiAnnouncement) {
    this.announcementMessage = announcement;
    this.announcementDialogOpen = open;
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
  setValidating(validating: boolean) {
    this.isValidating = validating;
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
  setItemTableMenuAnchor(el: HTMLElement | null) {
    this.itemTableMenuAnchor = el;
  }

  @action
  setGroupDialogOpen(open: boolean, type?: GroupDialogType) {
    if (open) {
      this.groupDialogType = type;
    }
    this.groupDialogOpen = open;
  }

  @action
  setSelectedPricedItem(item?: IPricedItem) {
    this.selectedPricedItem = item;
  }

  @action
  setCustomPriceDialogOpen(open: boolean, row?: IPricedItem) {
    this.customPriceDialogOpen = open;
    this.setSelectedPricedItem(row);
  }

  @action
  setSessIdCookie(sessionId: string) {
    const cookie = constructCookie(sessionId);
    return authService.setAuthCookie(cookie).pipe(
      map(() => {
        return runInAction(() => {
          this.sessIdCookie = cookie;
        });
      })
    );
  }

  @action
  removeSessIdCookie() {
    return authService.removeAuthCookie().pipe(
      map(() => {
        return runInAction(() => {
          this.sessIdCookie = undefined;
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
  setPriceTableFilterText(text: string) {
    this.priceTableFilterText = text;
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
