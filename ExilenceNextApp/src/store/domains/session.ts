import { action, autorun, computed, makeObservable, observable, runInAction } from 'mobx';
import { persist } from 'mobx-persist';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Snapshot } from './snapshot';
import { rootStore } from './../../index';
import {
  calculateNetWorth,
  calculateRelativTimeStampValue,
  calculateSessionIncome,
  diffSnapshots,
  filterItems,
  filterSnapshotItems,
  formatSessionTimesIncomeForChart,
  formatSessionTimesNetWorthForChart,
  formatSnapshotsForChart,
  formatStashTabSnapshotsForChart,
  getValueForSnapshot,
  getValueForSnapshotsTabs,
  mapSnapshotToApiSnapshot,
  mergeFromDiffSnapshotStashTabs,
} from '../../utils/snapshot.utils';
import { StashTabSnapshot } from './stashtab-snapshot';
import {
  IConnectionChartSeries,
  IDataChartSeries,
  ISessionTimeChartSeries,
  ISessionTimePieChartSeries,
} from '../../interfaces/connection-chart-series.interface';
import { IChartStashTabSnapshot } from '../../interfaces/chart-stash-tab-snapshot.interface';
import { ISparklineDataPoint } from '../../interfaces/sparkline-data-point.interface';
import HC from 'highcharts';
import { primaryDarker } from '../../assets/themes/exilence-theme';
import _ from 'lodash';
import { INetworthSessionOffsets } from '../../interfaces/snapshot-networth-session.interface';
import {
  ITimeStamp,
  TimestapTypes,
  TimestapTypesExtended,
} from '../../interfaces/net-worth_session_timespan.interface';
import { IApiSnapshot } from '../../interfaces/api/api-snapshot.interface';
import { assert } from 'console';

// TODO: Add to roundtour on new account + 1 Sessions als beta markieren
// DONE: 2 Snapshotberechnung & Networth berechnen -> Differenzberechnung die alten Mengen + Preise abziehen und Differenz mit neuen Preise verrechnen
// DONE: 4 Stop Button -> Warning with current stats - Starttime, PauseDuration, OfflineDuration, ManualAdjustmanDuration
// TODO: Anbieten, wie das income berechnet werden soll. Basierend auf X Stunden oder nicht sondern auf Session Zeit

// DONE: 5 Neues Diagramm mit -> Current stats - Starttime, PauseDuration, OfflineDuration, ManualAdjustmanDuration
// DONE: Add Timestamp Charts
// DONE: 6 ManualAdjustmanDuration mit "SettingsIcon" -> Dialog mit Current time + Formular with Formatted Input: HH:mm:ss + Add and Substract Button
// DONE: Set session offline in main fpr event ""
// DONE: Based on last hour => Abändern
// DONE: Add note to remove snapshots -> With value and remove snapshots for session as well
// REJECTED: Calculate income for each second because the session timer is dynamic
// DONE: Modify Profile stash tabs causes added or removed stashtabs added to sessionStartSnapshot
// DONE: Sign out => Session offline
// TODO: Add Text Area for custom notes
// DONE: Make snapshots clickable
// TODO: Improve moment use UTC and format to local time because moment() could created in different timezones

// DONE: Show snapshot on click in chart, when snapshot clicked in chart
// REJECTED: Snapshot löschbar auf click
// TODO: Add Pause and Continue button to networth overlay
// TODO: Scope in timespan on click / Not possible?

// TODO: Add settings for sessions?
// TODO: Income based on end of last inactivity / last offline
// TODO: Option to not show items negativly, who are removed from your current wealth while the session started

// TODO: Session Duration History Snapshot - Smooth the lines, the start end end for the snapshots should be the same lines as net worth history
// DONE: Isolate session from other sessions while the session is inactive -> Diffitems will removed
// DONE: Session duration breakdown history chart dynamically recalculated

// Client.txt:
// TODO: Start and stop session if poe charakter is logged in and stop if loggt out -> with settings checkbox

// Groups:
// Track Strash from group different - Each member with separate netWorth and income as line

// FIXED: Wrong Time format: HH:MM => HH:mm
// Other:
// DONE: Add critical stash tabs with tooltip info

type historyChartSeriesMode = 'netWorth' | 'income' | 'both';

export class Session {
  @persist uuid: string = uuidv4();
  @persist @observable profileId: string | undefined = undefined;

  // Only used to remove this snapshow difference from new snapshots
  @persist('object', Snapshot) @observable sessionStartSnapshot: Snapshot | undefined = undefined;
  @persist('list', Snapshot) @observable snapshots: Snapshot[] = [];

  @persist @observable sessionStarted: boolean = false;
  @persist @observable sessionPaused: boolean = false;
  @persist @observable sessionStartedAt: number | undefined = undefined;

  @persist('list') @observable timeStamps: ITimeStamp[] = [];
  @persist @observable lastStartAt: number | undefined = undefined;
  @persist @observable lastPauseAt: number | undefined = undefined;
  @persist @observable lastOfflineAt: number | undefined = undefined;
  @persist @observable lastNotActiveAt: number | undefined = undefined;
  @persist @observable stoppedAt: number | undefined = undefined;

  // Triggers recalculation of timestamp
  @observable pseudoOffsetForStart: number = 0;
  @persist @observable offsetPause: number = 0;
  @persist @observable offsetOffline: number = 0;
  @persist @observable offsetNotActive: number = 0;
  @persist @observable offsetManualAdjustment: number = 0;

  @persist @observable addNextSnapshotDiffToBase: boolean = false;

  @observable chartPreviewSnapshotId: string | undefined = undefined;
  @observable historyChartMode: historyChartSeriesMode = 'netWorth';

  constructor(profileId: string) {
    makeObservable(this);
    this.profileId = profileId;

    // Automatically reset snapshot preview, if not visible anymore
    autorun(() => {
      if (!this.isSnapshotPreviewVisible) {
        this.setSnapshotPreview(undefined);
      }
    });
  }

  @computed
  get profile() {
    return rootStore.accountStore.getSelectedAccount.profiles.find(
      (p) => p.uuid === this.profileId
    );
  }

  @action
  setProfileId(id: string) {
    this.profileId = id;
  }

  @action
  saveSnapshot(newSnapshotToAdd: Snapshot) {
    // Update the offsets to recalculate the correct sessionTimestamp and networthSessionDuration

    if (!this.profile) {
      console.error('Profile is not set to session:', this.uuid);
      return;
    }
    if (!this.sessionStarted) return;

    // Update offsets and save them in snapshot for historical views
    this.resolveTimeAndContinueWith('keeplast');
    const networthSessionOffsets: INetworthSessionOffsets = {
      sessionDuration: moment.utc().diff(this.sessionTimestamp),
      offsetPause: this.offsetPause,
      offsetOffline: this.offsetOffline,
      offsetNotActive: this.offsetNotActive,
      offsetManualAdjustment: this.offsetManualAdjustment,
    };

    if (!this.sessionStartSnapshot) {
      // Assign first snapshot until invalidated via session stop
      this.sessionStartSnapshot = new Snapshot(newSnapshotToAdd);
      this.sessionStartSnapshot.networthSessionOffsets = networthSessionOffsets;
      // Prevent that after 10 snapshots the items will be deleted
      this.sessionStartSnapshot.stashTabSnapshots = newSnapshotToAdd.stashTabSnapshots.map(
        (stss) => new StashTabSnapshot(stss)
      );

      // This is the base
      const snapshotToAdd = new Snapshot();
      snapshotToAdd.uuid = this.sessionStartSnapshot.uuid;
      snapshotToAdd.created = this.sessionStartSnapshot.created;
      snapshotToAdd.networthSessionOffsets = this.sessionStartSnapshot.networthSessionOffsets;
      snapshotToAdd.stashTabSnapshots = this.sessionStartSnapshot.stashTabSnapshots.map((stss) => {
        const stashTab = new StashTabSnapshot(stss);
        stashTab.pricedItems = [];
        stashTab.value = 0;
        return stashTab;
      });
      this.snapshots.unshift(snapshotToAdd);
      return;
    }
    // Remove removed stashTabs which were active
    this.sessionStartSnapshot.stashTabSnapshots = this.sessionStartSnapshot.stashTabSnapshots.filter(
      (sts) => this.profile?.activeStashTabIds.some((stId) => stId === sts.stashTabId)
    );

    // Add added stashTabs which are now active - keep them in newSnapshotToAdd to calc value = 0
    const addedStashTabs = this.profile?.activeStashTabIds.filter(
      (stId) => !this.sessionStartSnapshot?.stashTabSnapshots.some((sts) => stId === sts.stashTabId)
    );

    // Use api snapshot to create cloned items
    const newApiSnapshotToAdd = mapSnapshotToApiSnapshot(newSnapshotToAdd);

    // Keep the new stashtabs in newSnapshotToAdd to calc value = 0
    if (addedStashTabs.length > 0) {
      newApiSnapshotToAdd.stashTabs.forEach((asts) => {
        const newStashTabSnapshot = addedStashTabs.some((stId) => stId === asts.stashTabId);
        if (newStashTabSnapshot) {
          const sts = new StashTabSnapshot();
          sts.uuid = asts.uuid;
          sts.stashTabId = asts.stashTabId;
          sts.value = asts.value;
          sts.pricedItems = asts.pricedItems;
          this.sessionStartSnapshot?.stashTabSnapshots.push(sts);
        }
      });
    }

    // All cloned - run on second snapshot -
    // Updates prices from removed items with resolver with holds the current prices used to create they snapshot
    let diffSnapshot = mergeFromDiffSnapshotStashTabs(
      mapSnapshotToApiSnapshot(this.sessionStartSnapshot),
      newApiSnapshotToAdd,
      true,
      this.profile?.diffSnapshotPriceResolver
    );

    if (this.addNextSnapshotDiffToBase) {
      // First snapshot after the profile is activ again - remove the diffitems while inactiv
      const diffSnapshotWhileInactiv = mergeFromDiffSnapshotStashTabs(
        mapSnapshotToApiSnapshot(this.snapshots[0]), // Snapshot before inactiv
        diffSnapshot, // Snapshot after inactiv
        true,
        this.profile?.diffSnapshotPriceResolver
      );

      // Calculate the new sessionStartSnapshot. The diffitems will be added to remove them for new snapshots
      const newSessionStartSnapshot = mergeFromDiffSnapshotStashTabs(
        mapSnapshotToApiSnapshot(this.sessionStartSnapshot),
        diffSnapshotWhileInactiv,
        true,
        this.profile?.diffSnapshotPriceResolver,
        true // Add removed items from sessionStartSnapshot
      );

      const sessionStartSnapshot = new Snapshot();
      sessionStartSnapshot.uuid = this.sessionStartSnapshot.uuid;
      sessionStartSnapshot.created = this.sessionStartSnapshot.created;
      sessionStartSnapshot.networthSessionOffsets = this.sessionStartSnapshot.networthSessionOffsets;
      sessionStartSnapshot.stashTabSnapshots = newSessionStartSnapshot.stashTabs.map(
        (stss) => new StashTabSnapshot(stss)
      );
      this.sessionStartSnapshot = sessionStartSnapshot;

      // The sessionStartSnapshot is updated, now recalculate the diffSnapshot
      diffSnapshot = mergeFromDiffSnapshotStashTabs(
        mapSnapshotToApiSnapshot(this.sessionStartSnapshot),
        newApiSnapshotToAdd,
        true,
        this.profile?.diffSnapshotPriceResolver
      );

      this.addNextSnapshotDiffToBase = false;
    }

    // Assign first snapshot until invalidated via session stop
    const snapshotToAdd = new Snapshot();
    snapshotToAdd.uuid = diffSnapshot.uuid;
    snapshotToAdd.created = diffSnapshot.created;
    snapshotToAdd.networthSessionOffsets = networthSessionOffsets;
    snapshotToAdd.stashTabSnapshots = diffSnapshot.stashTabs.map(
      (stss) => new StashTabSnapshot(stss)
    );

    // keep items for only 10 snapshots at all times
    if (this.snapshots.length > 10) {
      this.snapshots[10].stashTabSnapshots.forEach((stss) => {
        stss.pricedItems = [];
      });
    }

    runInAction(() => {
      this.snapshots.unshift(snapshotToAdd);
      this.snapshots = this.snapshots.slice(0, 1000);
    });
  }

  //#region Session handling

  @action
  startSession() {
    // Set start; If already started - continue from pause mode
    if (!this.sessionStarted) {
      if (rootStore.uiStateStore.firstNetWorthSessionTour) {
        // Start net worth session tour after the start button is clicked the first time
        rootStore.uiStateStore.setFirstNetWorthSessionTour(false);
        rootStore.uiStateStore.setToolbarNetWorthSessionTourOpen(true);
      }

      this.sessionStartedAt = moment.utc().valueOf();
      // Show session net worth by default on start
      rootStore.uiStateStore.toggleNetWorthSession(true);
      // Make snapshot and refresh data
      rootStore.accountStore.getSelectedAccount.queueSnapshot(1);
    }
    this.resolveTimeAndContinueWith('start');
  }

  @action
  pauseSession() {
    if (this.sessionStarted) {
      this.resolveTimeAndContinueWith('pause');
    }
  }

  @action
  offlineSession() {
    // If the app gets closed
    if (this.sessionStarted) {
      this.resolveTimeAndContinueWith('offline');
    }
  }

  @action
  disableSession() {
    // If the profile gets disabled
    if (this.sessionStarted) {
      this.resolveTimeAndContinueWith('notActive');
      this.addNextSnapshotDiffToBase = true;
    }
  }

  @action
  stopSession() {
    this.resolveTimeAndContinueWith('pause');
    this.stoppedAt = this.lastPauseAt; // Special behaviour
    this.lastPauseAt = undefined;
    this.profile?.newSession();
    rootStore.uiStateStore.toggleNetWorthSession(false);
  }

  //#endregion

  //#region Time manipulation
  createTimestamp(time: number, type: TimestapTypes): ITimeStamp {
    const lastTime = moment.utc(time);
    const now = moment.utc();
    const diff = now.diff(lastTime);
    return {
      uuid: uuidv4(),
      type: type,
      start: lastTime.valueOf(),
      end: now.valueOf(),
      duration: diff,
      sessionDuration: moment.utc().diff(this.sessionTimestamp),
    };
  }

  @action
  resolveLast(time: number, type: TimestapTypes) {
    const timestamp = this.createTimestamp(time, type);
    if (this.timeStamps.length > 0 && this.timeStamps[0].type === type) {
      this.timeStamps[0].end = timestamp.end;
      this.timeStamps[0].duration += timestamp.duration;
      if (this.timeStamps.length > 1 && this.timeStamps[0].start == this.timeStamps[1].end) {
        this.timeStamps[0].start = this.timeStamps[1].end + 1;
      }
    } else {
      this.timeStamps.unshift(timestamp);
      if (this.timeStamps.length > 1 && this.timeStamps[0].start == this.timeStamps[1].end) {
        this.timeStamps[0].start = this.timeStamps[1].end + 1;
      }
    }
    return timestamp;
  }

  @action
  resolveTimeAndContinueWith(continueWith: TimestapTypesExtended) {
    let lastType: TimestapTypes = 'pause';
    if (this.lastStartAt) {
      this.resolveLast(this.lastStartAt, 'start');
      // Trigger computed function "get sessionTimestamp" to force recompute all functions that rely on the sessionTimestamp
      // Especially because the moment.utc().diff(sessionTimestamp) relies on this
      this.pseudoOffsetForStart += 1;
      this.lastStartAt = undefined;
      lastType = 'start';
    } else if (this.lastPauseAt) {
      const timestamp = this.resolveLast(this.lastPauseAt, 'pause');
      this.offsetPause += timestamp.duration;
      this.lastPauseAt = undefined;
      lastType = 'pause';
    } else if (this.lastOfflineAt) {
      const timestamp = this.resolveLast(this.lastOfflineAt, 'offline');
      this.offsetOffline += timestamp.duration;
      this.lastOfflineAt = undefined;
      lastType = 'offline';
    } else if (this.lastNotActiveAt) {
      const timestamp = this.resolveLast(this.lastNotActiveAt, 'notActive');
      this.offsetNotActive += timestamp.duration;
      this.lastNotActiveAt = undefined;
      lastType = 'notActive';
    }
    if (continueWith === 'start' || (continueWith === 'keeplast' && lastType === 'start')) {
      this.lastStartAt = moment.utc().valueOf();
      this.sessionStarted = true;
      this.sessionPaused = false;
    } else if (continueWith === 'pause' || (continueWith === 'keeplast' && lastType === 'pause')) {
      this.lastPauseAt = moment.utc().valueOf();
      this.sessionPaused = true;
    } else if (
      continueWith === 'offline' ||
      (continueWith === 'keeplast' && lastType === 'offline')
    ) {
      this.lastOfflineAt = moment.utc().valueOf();
      this.sessionPaused = true;
    } else if (
      continueWith === 'notActive' ||
      (continueWith === 'keeplast' && lastType === 'notActive')
    ) {
      this.lastNotActiveAt = moment.utc().valueOf();
      this.sessionPaused = true;
    }

    // Ensure session is valid
    if (!this.sessionStarted) {
      return rootStore.uiStateStore.toggleNetWorthSession(false);
    }

    if (lastType === 'notActive' && continueWith !== 'notActive') {
      // Make snapshot to remove the diff items
      // This must be directly after being activ again,
      // Because all items within the timespan from being active and the first snapshot after being active will be removed
      rootStore.accountStore.getSelectedAccount.queueSnapshot(1);
    }
  }

  @action
  addManualAdjustment(adjustment: number) {
    this.resolveTimeAndContinueWith('keeplast');
    this.offsetManualAdjustment += adjustment;
  }

  //#endregion

  //#region Time calculation and formatting

  @computed
  get sessionTimestamp() {
    // This function triggers all calculations that rely on the offsets
    // Fix to moment diff timestamps, force recompution
    this.pseudoOffsetForStart;
    const sessionTime = moment
      .utc(this.sessionStartedAt)
      .add(
        this.offsetPause + this.offsetOffline + this.offsetNotActive + this.offsetManualAdjustment,
        'millisecond'
      );
    // Do not calc diff, because cached values will cause invalid sessiontime
    return sessionTime;
  }

  getFormattedDuration(diff: number | undefined) {
    if (!diff) return '00:00:00';
    // Show more than 24h
    const duration = moment.duration(diff);

    const hours = Math.floor(duration.asHours());
    const mins = Math.floor(duration.asMinutes()) - hours * 60;
    const sec = Math.floor(duration.asSeconds()) - hours * 60 * 60 - mins * 60;

    const hoursPadded =
      hours > 99 ? hours.toString().padStart(3, '0') : hours.toString().padStart(2, '0');
    const minsPadded = mins.toString().padStart(2, '0');
    const secPadded = sec.toString().padStart(2, '0');

    // Currently, this cann´t handle negativ values: If negativ the times stats at: 1:59:59
    return `${hoursPadded}:${minsPadded}:${secPadded}`;
  }

  get formattedSessionDuration() {
    // This calculates the correct timestamp used for clocks - do not annotate this with @computed!
    let offsetPause = this.offsetPause;
    let offsetOffline = this.offsetOffline;
    let offsetNotActive = this.offsetNotActive;
    if (this.lastPauseAt) {
      const timestamp = this.resolveLast(this.lastPauseAt, 'pause');
      offsetPause += timestamp.duration;
    } else if (this.lastOfflineAt) {
      const timestamp = this.resolveLast(this.lastOfflineAt, 'offline');
      offsetOffline += timestamp.duration;
    } else if (this.lastNotActiveAt) {
      const timestamp = this.resolveLast(this.lastNotActiveAt, 'notActive');
      offsetNotActive += timestamp.duration;
    } else {
      // Nothing changed -> Online
      return this.getFormattedDuration(moment.utc().diff(this.sessionTimestamp));
    }

    this.pseudoOffsetForStart;
    const sessionTime = moment
      .utc(this.sessionStartedAt)
      .add(
        offsetPause + offsetOffline + offsetNotActive + this.offsetManualAdjustment,
        'millisecond'
      );
    // Do not calc diff, because cached values will cause invalid sessiontime
    return this.getFormattedDuration(moment.utc().diff(sessionTime));
  }

  get timecalculation() {
    return {
      offsetPause: this.offsetPause,
      offsetOffline: this.offsetOffline,
      offsetNotActive: this.offsetNotActive,
      offsetManualAdjustment: this.offsetManualAdjustment,
    };
  }

  @computed
  get previewSessionDuration() {
    if (this.chartPreviewSnapshotId) {
      const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
      if (index !== -1 && this.snapshots[index].networthSessionOffsets) {
        return this.getFormattedDuration(
          this.snapshots[index].networthSessionOffsets!.sessionDuration
        );
      }
    }
  }

  //#endregion

  //#region Widget calculation

  @computed
  get income() {
    let incomePerHour = 0;

    if (this.chartPreviewSnapshotId) {
      const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
      if (index !== -1 && this.snapshots[index].networthSessionOffsets) {
        const sessionDuration = this.snapshots[index].networthSessionOffsets!.sessionDuration;
        let hoursToCalcOver = sessionDuration! / 1000 / 60 / 60;
        hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;

        const lastSnapshot = mapSnapshotToApiSnapshot(this.snapshots[index]);
        const firstSnapshot = mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1]);

        incomePerHour =
          (calculateNetWorth([lastSnapshot]) - calculateNetWorth([firstSnapshot])) /
          hoursToCalcOver;
      } else {
        return 0;
      }
    } else if (this.snapshots.length > 1) {
      const sessionDuration = moment.utc().diff(this.sessionTimestamp);
      let hoursToCalcOver = sessionDuration / 1000 / 60 / 60;
      hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;

      const lastSnapshot = mapSnapshotToApiSnapshot(this.snapshots[0]);
      const firstSnapshot = mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1]);

      incomePerHour =
        (calculateNetWorth([lastSnapshot]) - calculateNetWorth([firstSnapshot])) / hoursToCalcOver;
    }
    return incomePerHour;
  }

  @computed
  get netWorthValue() {
    if (this.snapshots.length === 0) {
      return 0;
    }

    let calculatedValue: number;
    if (this.chartPreviewSnapshotId) {
      const snapshot = this.snapshots.find((s) => s.uuid === this.chartPreviewSnapshotId);
      if (!snapshot) {
        return 0;
      }
      calculatedValue = calculateNetWorth([mapSnapshotToApiSnapshot(snapshot)]);
    } else {
      calculatedValue = calculateNetWorth([mapSnapshotToApiSnapshot(this.snapshots[0])]);
    }
    if (rootStore.settingStore.currency === 'exalt' && rootStore.priceStore.exaltedPrice) {
      calculatedValue = calculatedValue / rootStore.priceStore.exaltedPrice;
    }
    if (rootStore.settingStore.currency === 'divine' && rootStore.priceStore.divinePrice) {
      calculatedValue = calculatedValue / rootStore.priceStore.divinePrice;
    }
    return calculatedValue;
  }

  @computed
  get lastSnapshotChange() {
    if (this.snapshots.length < 2) {
      return 0;
    }
    let lastSnapshotNetWorth: number;
    let previousSnapshotNetWorth: number;
    if (this.chartPreviewSnapshotId) {
      const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
      if (index !== -1 && index + 1 < this.snapshots.length) {
        lastSnapshotNetWorth = getValueForSnapshotsTabs([
          mapSnapshotToApiSnapshot(this.snapshots[index]),
        ]);
        previousSnapshotNetWorth = getValueForSnapshotsTabs([
          mapSnapshotToApiSnapshot(this.snapshots[index + 1]),
        ]);
      } else {
        return 0;
      }
    } else {
      lastSnapshotNetWorth = getValueForSnapshotsTabs([
        mapSnapshotToApiSnapshot(this.snapshots[0]),
      ]);
      previousSnapshotNetWorth = getValueForSnapshotsTabs([
        mapSnapshotToApiSnapshot(this.snapshots[1]),
      ]);
    }

    if (rootStore.settingStore.currency === 'exalt' && rootStore.priceStore.exaltedPrice) {
      lastSnapshotNetWorth = lastSnapshotNetWorth / rootStore.priceStore.exaltedPrice;
      previousSnapshotNetWorth = previousSnapshotNetWorth / rootStore.priceStore.exaltedPrice;
    }
    if (rootStore.settingStore.currency === 'divine' && rootStore.priceStore.divinePrice) {
      lastSnapshotNetWorth = lastSnapshotNetWorth / rootStore.priceStore.divinePrice;
      previousSnapshotNetWorth = previousSnapshotNetWorth / rootStore.priceStore.divinePrice;
    }
    return lastSnapshotNetWorth - previousSnapshotNetWorth;
  }

  //#endregion Widget calculation

  //#region Table calculation
  @computed
  get items() {
    const diffSelected = rootStore.uiStateStore.itemTableSelection === 'comparison';
    if (this.snapshots.length === 0 || (diffSelected && this.snapshots.length < 2)) {
      return [];
    }
    const filterText = rootStore.uiStateStore.itemTableFilterText.toLowerCase();
    if (diffSelected) {
      if (this.chartPreviewSnapshotId) {
        const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
        if (index !== -1 && index + 1 < this.snapshots.length) {
          // Snapshots after 10 will have not items at all. The no items wording is updated
          return filterItems(
            diffSnapshots(
              mapSnapshotToApiSnapshot(this.snapshots[index + 1]),
              mapSnapshotToApiSnapshot(this.snapshots[index]),
              true
              // Priceresolver does not work here, because of historical prices
            ),
            filterText
          );
        } else {
          return [];
        }
      }

      return filterItems(
        diffSnapshots(
          mapSnapshotToApiSnapshot(this.snapshots[1]),
          mapSnapshotToApiSnapshot(this.snapshots[0]),
          true,
          this.profile?.diffSnapshotPriceResolver
        ),
        filterText
      );
    }

    if (this.chartPreviewSnapshotId) {
      const snapshot = this.snapshots.find((s) => s.uuid === this.chartPreviewSnapshotId);
      if (snapshot) {
        return filterSnapshotItems(
          [mapSnapshotToApiSnapshot(snapshot)],
          filterText,
          rootStore.uiStateStore.filteredStashTabs
        );
      } else {
        return [];
      }
    }

    return filterSnapshotItems(
      [mapSnapshotToApiSnapshot(this.snapshots[0])],
      filterText,
      rootStore.uiStateStore.filteredStashTabs
    );
  }
  //#endregion Table calculation

  //#region Snapshot preview

  @action
  setSnapshotPreview(id: string | undefined) {
    this.chartPreviewSnapshotId = id;
  }

  @computed
  get snapshotPreviewIndex() {
    return this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
  }

  @computed
  get isSnapshotPreviewVisible() {
    // Used in autorun
    try {
      let timeStamp: moment.Moment | undefined;
      if (rootStore.uiStateStore.chartTimeSpan === '1 hour') {
        timeStamp = moment().subtract(1, 'h');
      } else if (rootStore.uiStateStore.chartTimeSpan === '1 day') {
        timeStamp = moment().subtract(1, 'd');
      } else if (rootStore.uiStateStore.chartTimeSpan === '1 week') {
        timeStamp = moment().subtract(7, 'd');
      } else if (rootStore.uiStateStore.chartTimeSpan === '1 month') {
        timeStamp = moment().subtract(30, 'd');
      } else {
        return true;
      }
      const snapshots = [...this.snapshots];
      return snapshots
        .filter((s) => timeStamp?.isBefore(moment(s.created)))
        .some((s) => s.uuid === this.chartPreviewSnapshotId);
    } catch (error) {
      // Rootstore not init on appstart - preview is not persists - so default is false
      false;
    }
  }

  //#endregion Snapshot preview

  //#region Chart calculation

  @computed
  get chartData() {
    let snapshots = [...this.snapshots];

    if (snapshots.length === 0) {
      return undefined;
    }

    switch (rootStore.uiStateStore.networthSessionSnapshotChartTimeSpan) {
      case '1 hour': {
        snapshots = snapshots.filter((s) => {
          return moment().subtract(1, 'h').isBefore(moment(s.created));
        });
        break;
      }
      case '1 day': {
        snapshots = snapshots.filter((s) => {
          return moment().subtract(24, 'h').isBefore(moment(s.created));
        });
        break;
      }
      case '1 week': {
        snapshots = snapshots.filter((s) => moment().subtract(7, 'd').isBefore(moment(s.created)));
        break;
      }
      case '1 month': {
        snapshots = snapshots.filter((s) => moment().subtract(30, 'd').isBefore(moment(s.created)));
        break;
      }
      default: {
        // all time
        break;
      }
    }

    const connectionSeries: IConnectionChartSeries = {
      seriesName: this.profile?.name || '',
      series: formatSnapshotsForChart(snapshots.map((s) => mapSnapshotToApiSnapshot(s))),
    };

    return [connectionSeries];
  }

  @computed
  get sparklineChartData(): ISparklineDataPoint[] | undefined {
    let snapshots: Snapshot[] = [];
    if (this.chartPreviewSnapshotId) {
      const snapshot = this.snapshots.find((s) => s.uuid === this.chartPreviewSnapshotId);
      if (!snapshot) {
        return;
      }
      const sortedSnapshots = this.snapshots
        .filter((s) => moment(snapshot.created).isAfter(moment(s.created)))
        .slice(0, 10)
        .sort((a, b) => (moment(a.created).isAfter(b.created) ? 1 : -1));
      snapshots = [...sortedSnapshots];
    } else {
      const sortedSnapshots = this.snapshots
        .slice(0, 10)
        .sort((a, b) => (moment(a.created).isAfter(b.created) ? 1 : -1));
      snapshots = [...sortedSnapshots];
    }

    if (snapshots.length === 0) {
      return;
    }
    return snapshots.map((s, i) => {
      return {
        x: i + 1,
        y: getValueForSnapshot(mapSnapshotToApiSnapshot(s)),
      } as ISparklineDataPoint;
    });
  }

  @computed
  get tabChartData() {
    const snapshots = [...this.snapshots.slice(0, 50)];

    const league = rootStore.leagueStore.leagues.find((l) => l.id === this.profile?.activeLeagueId);

    if (snapshots.length === 0 || !league) {
      return undefined;
    }

    const accountLeague = rootStore.accountStore.getSelectedAccount.accountLeagues.find(
      (l) => l.leagueId === league.id
    );

    if (!accountLeague) {
      return undefined;
    }

    const series: IConnectionChartSeries[] = [];

    let stashTabSnapshots: IChartStashTabSnapshot[] = [];

    snapshots.map((s) => {
      const data = s.stashTabSnapshots.map((sts) => {
        return {
          value: sts.value,
          stashTabId: sts.stashTabId,
          created: s.created,
        } as IChartStashTabSnapshot;
      });
      stashTabSnapshots = stashTabSnapshots.concat(data);
    });

    const groupedStashTabSnapshots = stashTabSnapshots.reduce(function (r, a) {
      r[a.stashTabId] = r[a.stashTabId] || [];
      r[a.stashTabId].push(a);
      return r;
    }, Object.create(null));

    this.profile?.activeStashTabIds.map((id) => {
      const stashTabName = accountLeague.stashtabList.find((s) => s.id === id)?.name;
      const serie: IConnectionChartSeries = {
        seriesName: stashTabName ?? '',
        series: formatStashTabSnapshotsForChart(
          groupedStashTabSnapshots[id] ? groupedStashTabSnapshots[id] : []
        ),
      };
      series.push(serie);
    });

    return series;
  }

  @computed
  get sessionTimePieChartData() {
    let sessionDuration = moment.utc().diff(this.sessionTimestamp);

    const getFormattedDuration = this.getFormattedDuration;

    const colors = [
      '#3ed914', // 'start'
      '#e8952e', // 'pause'
      '#eb2f26', // 'offline'
      '#de23de', // 'notActive'
      '#3119cf', // 'adjustments'
    ];

    let offsetPause = this.offsetPause;
    let offsetOffline = this.offsetOffline;
    let offsetNotActive = this.offsetNotActive;
    let offsetManualAdjustment = this.offsetManualAdjustment;

    if (this.chartPreviewSnapshotId) {
      const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
      if (index !== -1 && this.snapshots[index].networthSessionOffsets) {
        sessionDuration = this.snapshots[index].networthSessionOffsets!.sessionDuration;
        offsetPause = this.snapshots[index].networthSessionOffsets!.offsetPause;
        offsetOffline = this.snapshots[index].networthSessionOffsets!.offsetOffline;
        offsetNotActive = this.snapshots[index].networthSessionOffsets!.offsetNotActive;
        offsetManualAdjustment = this.snapshots[index].networthSessionOffsets!
          .offsetManualAdjustment;
      } else {
        sessionDuration = 0;
        offsetPause = 0;
        offsetOffline = 0;
        offsetNotActive = 0;
        offsetManualAdjustment = 0;
      }
    }

    const series: ISessionTimePieChartSeries[] = [
      {
        name: 'Duration',
        size: '60%',
        dataLabels: {
          distance: -30,
          enabled: false,
        },
        borderColor: primaryDarker,
        tooltip: {
          pointFormatter: function () {
            return `<span style="fill:${
              this.color
            }">\u25CF</span> Duration: <span style="font-weight:bold;">${getFormattedDuration(
              this.y
            )}</span>`;
          },
        },
        data: [
          {
            name: 'Online',
            y: sessionDuration || 0,
            color: colors[0],
            dataLabels: {
              distance: -30,
              enabled: true,
            },
          },
          {
            name: 'Adjustment',
            y: offsetManualAdjustment || 0,
            color: colors[4],
            dataLabels: {
              distance: 30,
              enabled: offsetManualAdjustment !== 0,
            },
          },
          {
            name: 'Pause',
            y: offsetPause || 0,
            color: colors[1],
          },
          {
            name: 'Offline',
            y: offsetOffline || 0,
            color: colors[2],
          },
          {
            name: 'Inactiv',
            y: offsetNotActive || 0,
            color: colors[3],
          },
        ],
      },
    ];

    series.push({
      name: 'Breakdown',
      size: '80%',
      innerSize: '60%',
      borderColor: primaryDarker,
      tooltip: {
        pointFormatter: function () {
          return `<span style="fill:${
            this.color
          }">\u25CF</span> Duration: <span style="font-weight:bold;">${getFormattedDuration(
            this.y
          )}</span>`;
        },
      },
      data: [
        {
          name: 'Online',
          y: sessionDuration + offsetManualAdjustment || 0,
          color: HC.color(colors[0]).setOpacity(0.5).brighten(0.2).get(),
          dataLabels: {
            enabled: false,
          },
        },
        {
          name: 'Adjustment',
          y: -(offsetManualAdjustment || 0),
          color: HC.color(colors[4]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Pause',
          y: offsetPause || 0,
          color: HC.color(colors[1]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Offline',
          y: offsetOffline || 0,
          color: HC.color(colors[2]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Inactiv',
          y: offsetNotActive || 0,
          color: HC.color(colors[3]).setOpacity(0.5).brighten(0.2).get(),
        },
      ],
    });

    return series;
  }

  @computed
  get sessionTimeChartData() {
    console.log('Recalculated');
    // FIXME: Cann't remove proxy from timeStamps via spread or assign ?
    let timestamps = _.cloneDeep(this.timeStamps) as ITimeStamp[];

    let snapshots = [...this.snapshots];

    const mode = this.historyChartMode;

    // mode = 'netWorth';

    let timeStamp: moment.Moment | undefined;
    if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 hour') {
      timeStamp = moment().subtract(1, 'h');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 day') {
      timeStamp = moment().subtract(24, 'h');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 week') {
      timeStamp = moment().subtract(7, 'd');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 month') {
      timeStamp = moment().subtract(30, 'd');
    }
    // Cut start timestamp
    if (timeStamp) {
      timestamps = timestamps.filter((s) => timeStamp?.isBefore(moment.utc(s.end)));
      snapshots = snapshots.filter((s) => timeStamp?.isBefore(moment(s.created)));
      if (timestamps.length > 0) {
        const isStartBefore = timeStamp.isBefore(
          moment.utc(timestamps[timestamps.length - 1].start)
        );
        if (!isStartBefore) {
          timestamps[timestamps.length - 1] = {
            ...timestamps[timestamps.length - 1],
            start: timeStamp.valueOf(),
          };
        }
      }
    }

    const series: ISessionTimeChartSeries[] = [];

    const fillColorStops = [
      HC.color('#3ed914').setOpacity(0.25).get('rgba'),
      HC.color('#e8952e').setOpacity(0.25).get('rgba'),
      HC.color('#eb2f26').setOpacity(0.25).get('rgba'),
      HC.color('#de23de').setOpacity(0.25).get('rgba'),
    ];

    timestamps.map((ts) => {
      let seriesName: string;
      let colorIndex: number;
      if (ts.type === 'start') {
        seriesName = 'Online';
        colorIndex = 0;
      } else if (ts.type === 'pause') {
        seriesName = 'Pause';
        colorIndex = 1;
      } else if (ts.type === 'offline') {
        seriesName = 'Offline';
        colorIndex = 2;
      } else {
        seriesName = 'Inactiv';
        colorIndex = 3;
      }

      const startDate = moment.utc(ts.start);
      const endDate = moment.utc(ts.end);
      const snapshotsBetween = snapshots.filter((s) => {
        return moment(s.created).isBetween(startDate, endDate, undefined, '(]');
      });

      const staticFields = {
        type: 'area',
        colorIndex,
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1,
          },
          stops: [
            [0, fillColorStops[colorIndex]],
            [1, HC.color(primaryDarker).setOpacity(0).get('rgba')],
          ],
        },
      };
      if (mode === 'netWorth' || mode === 'both') {
        series.push({
          ...staticFields,
          name: `${seriesName} - Net worth`,
          data: [
            {
              x: ts.start,
              y: 0, // Default, will recalculated later
              marker: {
                radius: 1,
                symbol: 'square',
              },
            },
            // Fill Snapshots - NetWorth; Sorted -> snapshotsBetween first index is the last index
            ...formatSessionTimesNetWorthForChart(
              snapshotsBetween.map((s) => mapSnapshotToApiSnapshot(s)),
              this // Set eventhandler for click which sets the preview of the snapshot
            ),
            {
              x: ts.end,
              y: snapshotsBetween[0]
                ? +getValueForSnapshot(mapSnapshotToApiSnapshot(snapshotsBetween[0])).toFixed(2)
                : 0,
              marker: {
                radius: 1,
                symbol: 'square',
              },
            },
          ],
        });
      }
      if (mode === 'income' || mode === 'both') {
        series.push({
          ...staticFields,
          name: `${seriesName} - Income`,
          data: [
            {
              x: ts.start,
              y: 0, // Default, will recalculated later
              marker: {
                radius: 1,
                symbol: 'square',
              },
            },
            // Fill Snapshots - Income; Sorted -> snapshotsBetween first index is the last index
            ...formatSessionTimesIncomeForChart(
              snapshotsBetween.map((s) => mapSnapshotToApiSnapshot(s)),
              this.snapshots.length > 0
                ? mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
                : undefined,
              this // Set eventhandler for click which sets the preview of the snapshot
            ),
            {
              x: ts.end,
              y:
                this.snapshots.length > 0 && snapshotsBetween[0]
                  ? +calculateSessionIncome(
                      mapSnapshotToApiSnapshot(snapshotsBetween[0]),
                      mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
                    ).toFixed(2)
                  : 0,
              marker: {
                radius: 1,
                symbol: 'square',
              },
            },
          ],
        });
      }
    });

    const seriesCount = mode === 'both' ? 2 : 1;

    if (series.length >= 2 && this.snapshots.length > snapshots.length) {
      // TODO: Verfiy straight lines
      // Calculate the first entry in the series for net worth and income
      // Use the latest snapshot before the first snapshot in the timespan
      const fallbackSnapshot = this.snapshots[snapshots.length];
      // Net worth
      if (mode === 'netWorth' || mode === 'both') {
        const firstNetWorthSeries = series[series.length - seriesCount];
        firstNetWorthSeries.data[0].y = +getValueForSnapshot(
          mapSnapshotToApiSnapshot(fallbackSnapshot)
        ).toFixed(2);
        if (firstNetWorthSeries.data.length === 2) {
          // The end values could not be calculated, because there are no snapshots between - set the start
          firstNetWorthSeries.data[1].y = firstNetWorthSeries.data[0].y;
        }
      }

      // Income
      if (mode === 'income' || mode === 'both') {
        const firstIncomeSeries = series[series.length - 1];
        firstIncomeSeries.data[0].y = +calculateSessionIncome(
          mapSnapshotToApiSnapshot(fallbackSnapshot),
          mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
        ).toFixed(2);
        if (firstIncomeSeries.data.length === 2) {
          // The end values could not be calculated, because there are no snapshots between - set the start
          firstIncomeSeries.data[1].y = firstIncomeSeries.data[0].y;
        }
      }
    }

    // For reference series last index => Position left in chart; Index 0 => Positon right in chart;
    for (let i = series.length - (1 + seriesCount); i >= 0; i--) {
      // Set the net worth and income for the beginning of a series to the end of the previous series
      const prevSeries = series[i + seriesCount];

      // Get the prev snapshot value
      let prevSnapshotDatapoint: IDataChartSeries | undefined;
      for (let j = i; j < series.length - seriesCount; j += seriesCount) {
        // Search in the series to the left (Before) for the last snapshot in the series
        if (series[j + seriesCount].data.length > 2) {
          const lastSnapshotIndexInSeries = series[j + seriesCount].data.length - 2;
          // Net worth and income
          prevSnapshotDatapoint = series[j + seriesCount].data[lastSnapshotIndexInSeries];
          break;
        }
      }
      // Get the next snapshot value for within the timestamp and after
      let nextSnapshotDatapoint: IDataChartSeries | undefined;
      for (let j = i - seriesCount; j >= -seriesCount; j -= seriesCount) {
        if (series[j + seriesCount].data.length > 2) {
          // Net worth and income
          nextSnapshotDatapoint = series[j + seriesCount].data[1];
          break;
        }
      }

      if (prevSnapshotDatapoint && nextSnapshotDatapoint) {
        // Snapshot datapoint before and within the current series found -> Calc relative value
        series[i].data[0].y = +calculateRelativTimeStampValue(
          { created: prevSnapshotDatapoint.x, value: prevSnapshotDatapoint.y },
          series[i].data[0].x,
          { created: nextSnapshotDatapoint.x, value: nextSnapshotDatapoint.y }
        ).toFixed(2);
        // Sync the datapoints - End from prev with start from current
        const lastDataIndex = prevSeries.data.length - 1;
        prevSeries.data[lastDataIndex].y = series[i].data[0].y;
      } else {
        series[i].data[0].y = prevSeries.data[prevSeries.data.length - 1].y;
      }

      // TODO: Verfiy straight lines
      if (series[i].data.length === 2) {
        // The end values could not be calculated, because there are no snapshots between - set to the start
        series[i].data[1].y = series[i].data[0].y;
      }
    }

    return series;
  }

  //#endregion Chart calculation

  @action
  removeSnapshots(snapshotIds: string[]) {
    this.snapshots = this.snapshots.filter((s) => !snapshotIds.find((id) => id === s.uuid));
  }
}
