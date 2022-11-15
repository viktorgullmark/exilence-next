import {
  action,
  autorun,
  reaction,
  computed,
  makeObservable,
  observable,
  runInAction,
  IReactionDisposer,
} from 'mobx';
import { persist } from 'mobx-persist';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { Snapshot } from './snapshot';
import { rootStore } from './../../index';
import {
  calculateRelativTimeStampValue,
  calculateSessionIncome,
  diffSnapshots,
  filterItems,
  filterSnapshotItems,
  formatSessionTimesIncomeForChart,
  formatSessionTimesNetWorthForChart,
  formatStashTabSnapshotsForChart,
  getValueForSnapshot,
  getValueForSnapshotsTabs,
  mapSnapshotToApiSnapshot,
  mergeFromDiffSnapshotStashTabs,
} from '../../utils/snapshot.utils';
import { StashTabSnapshot } from './stashtab-snapshot';
import {
  IConnectionChartSeries,
  ISessionTimeChartSeries,
  ISessionTimePieChartSeries,
  ISnapshotDataPoint,
  PointClickEventObjectExtended,
} from '../../interfaces/connection-chart-series.interface';
import { IChartStashTabSnapshot } from '../../interfaces/chart-stash-tab-snapshot.interface';
import { ISparklineDataPoint } from '../../interfaces/sparkline-data-point.interface';
import HC from 'highcharts';
import { netWorthSessionColors, primaryDarker } from '../../assets/themes/exilence-theme';
import _ from 'lodash';
import { INetworthSessionOffsets } from '../../interfaces/snapshot-networth-session.interface';
import {
  ITimeStamp,
  TimestapTypes,
  TimestapTypesExtended,
} from '../../interfaces/net-worth-session-timespan.interface';

// Next steps:
// TODO: Save session in backend
// TODO: Add groups gameplay somehow ;
// Problems: Who could change the states, how to keep in sync?
// Make sessions joinable? For example: The session owner starts a session. You could join the session with your current profile.
// -> The session owner controles the states; Income and networth is summed up
// -> Your current session for the profile is set to inactive while you joined the group owners session.
// The group session needs to be isolated from the current session; That you could continue without influence after the group session

// Features:
// TODO: Add settings for session:
// TODO: Option to not show items negativly, who are removed from your current wealth while the session started

// Big feature:
// TODO: Add this session to archive for later views or analysis

// Optional featues:
// TODO: Add Text Area for custom notes
// TODO: Add custom name for the session (on start) - show the name somewhere
// TODO: Change income in chart to the current income type
// TODO: Client.txt: Continue session if poe character is signed in and offline if signed out -> with settings checkbox
// TODO: Add not priced items from snapshots in a separate table below. Allow to set the prices manually
// Allow to modify the items prices for earlier snapshots via the historical view (click on a snapshot). This would affect all snapshot prices after the modified snapshot

// To be refactored - Can I do? This need to be tested very well:
// TODO: Improve moments to use UTC (moment.utc()) and format to local time (moment.utc().local().format("HH:mm:ss")) because moment() could created in different timezones and could lead to wrong times.

// Noticable fixes:
// FIXED: Networth overlay does not shows the currency in divine/ex when opened
// FIXED: Networth overlay does sometimes not update the states/is not in sync with the app
// FIXED: Wrong Time format for minutes(currently as month formated after hour): HH:MM => HH:mm
// Other
// Added: Add critical stash tabs with tooltip info

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

  // Note for backend persistence: This values can be restored from timeStamps[x].duration
  @persist @observable offsetPause: number = 0;
  @persist @observable offsetOffline: number = 0;
  @persist @observable offsetNotActive: number = 0;
  @persist @observable offsetManualAdjustment: number = 0;

  @persist @observable addNextSnapshotDiffToBase: boolean = false;

  @observable chartPreviewSnapshotId: string | undefined = undefined;

  reactionHandler: IReactionDisposer[] = [];

  constructor(profileId: string) {
    makeObservable(this);
    this.profileId = profileId;

    // Automatically reset snapshot preview, if not visible anymore
    this.reactionHandler.push(
      autorun(() => {
        try {
          if (!rootStore) return;
          if (!this.isSnapshotPreviewVisible) {
            this.setSnapshotPreview(undefined);
          }
        } catch (error) {
          return; // Rootstore not init yet
        }
      })
    );

    // Automatically sets the correct state (from inactiv|offline => pause; from offline|online|pause => inactiv)
    this.reactionHandler.push(
      autorun(() => {
        try {
          if (!rootStore) return;
          if (!this.profile) return;
          if (!this.sessionStarted) return;
          if (
            !this.profile.active ||
            rootStore.accountStore.getSelectedAccount.activeProfile?.uuid !== this.profile.uuid
          ) {
            this.disableSession();
          } else {
            this.pauseSession();
            this.profile.updateNetWorthOverlay();
          }
        } catch (error) {
          return; // Rootstore not init yet
        }
      })
    );

    // Automatically ensure the isolated stash tabs if they changed; If necessary make a snapshot to set the baseline
    this.reactionHandler.push(
      reaction(
        () => {
          try {
            this.profile?.activeStashTabIds;
          } catch (error) {
            return; // Rootstore not init yet
          }
        },
        () => {
          try {
            if (!rootStore) return;
            if (!this.profile) return;
            if (!this.sessionStarted || !this.sessionStartSnapshot) return;
            if (rootStore.accountStore.getSelectedAccount.activeProfile?.uuid !== this.profile.uuid)
              return;

            // Remove removed stashTabs which were active
            this.sessionStartSnapshot.stashTabSnapshots = this.sessionStartSnapshot.stashTabSnapshots.filter(
              (sts) => this.profile?.activeStashTabIds.some((stId) => stId === sts.stashTabId)
            );
            // Add added stashTabs which are now active - keep them in newSnapshotToAdd to calc value = 0
            const addedStashTabs = this.profile.activeStashTabIds.filter(
              (stId) =>
                !this.sessionStartSnapshot?.stashTabSnapshots.some((sts) => stId === sts.stashTabId)
            );
            if (addedStashTabs.length > 0) {
              // Make snapshot for the new stashtabs to save the current items as baseitems -> value 0;
              // Any item added after this snapshot will be added to the session
              rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
              rootStore.accountStore.getSelectedAccount.queueSnapshot(100);
            }
          } catch (error) {
            return; // Rootstore not init yet
          }
        }
      )
    );
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
        false, // Do not manipulate existing snapshot
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
      rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
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
      return true;
    }
  }

  @action
  disableSession() {
    // If the profile gets disabled
    if (this.sessionStarted) {
      this.resolveTimeAndContinueWith('notActive');
    }
  }

  @action
  stopSession() {
    this.resolveTimeAndContinueWith('pause');
    this.stoppedAt = this.lastPauseAt; // Special behaviour
    this.lastPauseAt = undefined;
    this.sessionStarted = false;
    rootStore.uiStateStore.toggleNetWorthSession(false);
    this.reactionHandler[1](); // Stop changing states
    this.reactionHandler[2](); // Stop tracking activeStashTabIds
    this.profile?.newSession();
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

    if (lastType === 'notActive' && (continueWith === 'start' || continueWith === 'pause')) {
      // Make snapshot to remove the diff items
      // This must be directly after being activ again,
      // Because all items within the timespan from being active and the first snapshot after being active will be removed
      this.addNextSnapshotDiffToBase = true;
      rootStore.accountStore.getSelectedAccount.dequeueSnapshot();
      rootStore.accountStore.getSelectedAccount.queueSnapshot(100);
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
    // This plugin shows more than 24h
    return moment.duration(diff).format('HH:mm:ss', {
      trim: false,
    });
  }

  get formattedSessionDuration() {
    // This calculates the correct timestamp used for clocks - do not annotate this with @computed!
    let offsetPause = this.offsetPause;
    let offsetOffline = this.offsetOffline;
    let offsetNotActive = this.offsetNotActive;
    if (this.lastPauseAt) {
      const timestamp = this.createTimestamp(this.lastPauseAt, 'pause');
      offsetPause += timestamp.duration;
    } else if (this.lastOfflineAt) {
      const timestamp = this.createTimestamp(this.lastOfflineAt, 'offline');
      offsetOffline += timestamp.duration;
    } else if (this.lastNotActiveAt) {
      const timestamp = this.createTimestamp(this.lastNotActiveAt, 'notActive');
      offsetNotActive += timestamp.duration;
    } else {
      // Nothing changed -> Online
      return this.getFormattedDuration(moment.utc().diff(this.sessionTimestamp));
    }

    const sessionTime = moment
      .utc(this.sessionStartedAt)
      .add(
        offsetPause + offsetOffline + offsetNotActive + this.offsetManualAdjustment,
        'millisecond'
      );
    // Do not calc diff, because cached values will cause invalid sessiontime
    return this.getFormattedDuration(moment.utc().diff(sessionTime));
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
  calculateIncome(timestamp: number) {
    if (this.snapshots.length < 2) return 0;
    const timestampToUse = moment.utc(timestamp);
    const snapshots = this.snapshots.filter((s) => moment(s.created).utc().isAfter(timestampToUse));
    if (snapshots.length === this.snapshots.length || snapshots.length === 0) return 0;
    const prevSnapshot = this.snapshots[snapshots.length];
    const firstSnapshotValue = calculateRelativTimeStampValue(
      {
        created: moment(new Date(prevSnapshot.created).getTime()).valueOf(),
        value: getValueForSnapshot(mapSnapshotToApiSnapshot(prevSnapshot)),
      },
      timestamp,
      {
        created: moment(new Date(snapshots[snapshots.length - 1].created).getTime()).valueOf(),
        value: getValueForSnapshot(mapSnapshotToApiSnapshot(snapshots[snapshots.length - 1])),
      }
    );
    const elapsedTime = moment(snapshots[0].created).diff(moment.utc(timestamp));
    let hoursToCalcOver = elapsedTime / 1000 / 60 / 60;
    hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;
    const lastSnapshotValue = getValueForSnapshot(mapSnapshotToApiSnapshot(snapshots[0]));
    return (lastSnapshotValue - firstSnapshotValue) / hoursToCalcOver;
  }

  get incomeSessionDuration() {
    if (this.snapshots.length < 2 || !this.snapshots[0].networthSessionOffsets) return 0;
    const elapsedTime = this.snapshots[0].networthSessionOffsets.sessionDuration;
    let hoursToCalcOver = elapsedTime / 1000 / 60 / 60;
    hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;
    const firstSnapshotValue = getValueForSnapshot(
      mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
    );
    const lastSnapshotValue = getValueForSnapshot(mapSnapshotToApiSnapshot(this.snapshots[0]));
    return (lastSnapshotValue - firstSnapshotValue) / hoursToCalcOver;
  }
  get incomeSinceLastPause() {
    const timestamp = this.timeStamps.find((ts) => ts.type === 'pause')?.end;
    if (!timestamp) return undefined;
    return this.calculateIncome(timestamp);
  }
  get incomeSinceLastOffline() {
    const timestamp = this.timeStamps.find((ts) => ts.type === 'offline')?.end;
    if (!timestamp) return undefined;
    return this.calculateIncome(timestamp);
  }
  get incomeSinceLastInactive() {
    const timestamp = this.timeStamps.find((ts) => ts.type === 'notActive')?.end;
    if (!timestamp) return undefined;
    return this.calculateIncome(timestamp);
  }
  get incomeSinceLastHour() {
    const timestamp = moment.utc().subtract(1, 'hours').valueOf();
    return this.calculateIncome(timestamp);
  }

  @computed
  get income() {
    if (this.chartPreviewSnapshotId) {
      const index = this.snapshots.findIndex((s) => s.uuid === this.chartPreviewSnapshotId);
      if (index !== -1 && this.snapshots[index].networthSessionOffsets) {
        const sessionDuration = this.snapshots[index].networthSessionOffsets!.sessionDuration;
        let hoursToCalcOver = sessionDuration / 1000 / 60 / 60;
        hoursToCalcOver = hoursToCalcOver >= 1 ? hoursToCalcOver : 1;

        const lastSnapshotValue = getValueForSnapshot(
          mapSnapshotToApiSnapshot(this.snapshots[index])
        );
        const firstSnapshotValue = getValueForSnapshot(
          mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
        );
        return (lastSnapshotValue - firstSnapshotValue) / hoursToCalcOver;
      } else {
        return 0;
      }
    }
    if (this.snapshots.length < 2) return 0;
    if (rootStore.uiStateStore!.netWorthSessionIncomeMode === 'lastPause') {
      return this.incomeSinceLastPause || 0;
    } else if (rootStore.uiStateStore!.netWorthSessionIncomeMode === 'lastOffline') {
      return this.incomeSinceLastOffline || 0;
    } else if (rootStore.uiStateStore!.netWorthSessionIncomeMode === 'lastInactiv') {
      return this.incomeSinceLastInactive || 0;
    } else if (rootStore.uiStateStore!.netWorthSessionIncomeMode === 'lastHour') {
      return this.incomeSinceLastHour;
    }
    // Default and fallback
    return this.incomeSessionDuration;
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
      calculatedValue = getValueForSnapshot(mapSnapshotToApiSnapshot(snapshot));
    } else {
      calculatedValue = getValueForSnapshot(mapSnapshotToApiSnapshot(this.snapshots[0]));
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
              false
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
          false,
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
    let timestamp: moment.Moment | undefined;
    if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 hour') {
      timestamp = moment().subtract(1, 'h');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 day') {
      timestamp = moment().subtract(1, 'd');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 week') {
      timestamp = moment().subtract(7, 'd');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 month') {
      timestamp = moment().subtract(30, 'd');
    } else {
      return true;
    }
    const snapshots = [...this.snapshots];
    return snapshots
      .filter((s) => timestamp?.isBefore(moment(s.created)))
      .some((s) => s.uuid === this.chartPreviewSnapshotId);
  }

  //#endregion Snapshot preview

  //#region Chart calculation

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
            color: netWorthSessionColors[0],
            dataLabels: {
              distance: -30,
              enabled: true,
            },
          },
          {
            name: 'Adjustment',
            y: offsetManualAdjustment || 0,
            color: netWorthSessionColors[4],
            dataLabels: {
              distance: 30,
              enabled: offsetManualAdjustment !== 0,
            },
          },
          {
            name: 'Pause',
            y: offsetPause || 0,
            color: netWorthSessionColors[1],
          },
          {
            name: 'Offline',
            y: offsetOffline || 0,
            color: netWorthSessionColors[2],
          },
          {
            name: 'Inactiv',
            y: offsetNotActive || 0,
            color: netWorthSessionColors[3],
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
          color: HC.color(netWorthSessionColors[0]).setOpacity(0.5).brighten(0.2).get(),
          dataLabels: {
            enabled: false,
          },
        },
        {
          name: 'Adjustment',
          y: -(offsetManualAdjustment || 0),
          color: HC.color(netWorthSessionColors[4]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Pause',
          y: offsetPause || 0,
          color: HC.color(netWorthSessionColors[1]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Offline',
          y: offsetOffline || 0,
          color: HC.color(netWorthSessionColors[2]).setOpacity(0.5).brighten(0.2).get(),
        },
        {
          name: 'Inactiv',
          y: offsetNotActive || 0,
          color: HC.color(netWorthSessionColors[3]).setOpacity(0.5).brighten(0.2).get(),
        },
      ],
    });

    return series;
  }

  @computed
  get sessionTimeChartData() {
    // FIXME: Cann't remove proxy from timeStamps via spread or assign ?
    let timestamps = _.cloneDeep(this.timeStamps) as ITimeStamp[];

    let snapshots = [...this.snapshots];

    const mode = rootStore.uiStateStore.netWorthSessionHistoryChartMode;

    let timestamp: moment.Moment | undefined;
    if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 hour') {
      timestamp = moment().subtract(1, 'h');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 day') {
      timestamp = moment().subtract(24, 'h');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 week') {
      timestamp = moment().subtract(7, 'd');
    } else if (rootStore.uiStateStore.networthSessionChartTimeSpan === '1 month') {
      timestamp = moment().subtract(30, 'd');
    }
    // Cut start timestamp
    if (timestamp) {
      timestamps = timestamps.filter((s) => timestamp?.isBefore(moment.utc(s.end)));
      snapshots = snapshots.filter((s) => timestamp?.isBefore(moment(s.created)));
      if (timestamps.length > 0) {
        const isStartBefore = timestamp.isBefore(
          moment.utc(timestamps[timestamps.length - 1].start)
        );
        if (!isStartBefore) {
          timestamps[timestamps.length - 1] = {
            ...timestamps[timestamps.length - 1],
            start: timestamp.valueOf(),
          };
        }
      }
    }

    const series: ISessionTimeChartSeries[] = [];

    const fillColorStops = [
      HC.color(netWorthSessionColors[0]).setOpacity(0.25).get('rgba'),
      HC.color(netWorthSessionColors[1]).setOpacity(0.25).get('rgba'),
      HC.color(netWorthSessionColors[2]).setOpacity(0.25).get('rgba'),
      HC.color(netWorthSessionColors[3]).setOpacity(0.25).get('rgba'),
    ];

    const pointClickHandler = (e: PointClickEventObjectExtended) => {
      if (!e.point.custom) return this.setSnapshotPreview(undefined);
      const snapshotId = e.point.custom;
      if (this.chartPreviewSnapshotId !== snapshotId) {
        this.setSnapshotPreview(snapshotId);
      } else {
        this.setSnapshotPreview(undefined);
      }
    };

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
                radius: 0,
                symbol: 'square',
              },
              events: {
                click: pointClickHandler,
              },
            },
            // Fill Snapshots - NetWorth; Sorted -> snapshotsBetween first index is the last index
            ...formatSessionTimesNetWorthForChart(
              snapshotsBetween.map((s) => mapSnapshotToApiSnapshot(s)),
              this // Set eventhandler for click which sets the preview of the snapshot
            ),
            {
              x: ts.end,
              y: 0, // Default, will recalculated later
              marker: {
                radius: 0,
                symbol: 'square',
              },
              events: {
                click: pointClickHandler,
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
                radius: 0,
                symbol: 'square',
              },
              events: {
                click: pointClickHandler,
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
              y: 0, // Default, will recalculated later
              marker: {
                radius: 0,
                symbol: 'square',
              },
              events: {
                click: pointClickHandler,
              },
            },
          ],
        });
      }
    });

    const seriesCount = mode === 'both' ? 2 : 1;

    // Get the latest snapshot in the timeseries before
    let snapshotDPBeforeTimespan: ISnapshotDataPoint[] = [];
    if (snapshots.length < this.snapshots.length) {
      const snapshotBeforeTimespan = mapSnapshotToApiSnapshot(this.snapshots[snapshots.length]);
      if (mode === 'both') {
        snapshotDPBeforeTimespan = [
          {
            created: moment(new Date(snapshotBeforeTimespan.created).getTime()).valueOf(),
            value: getValueForSnapshot(snapshotBeforeTimespan),
          },
          {
            created: moment(new Date(snapshotBeforeTimespan.created).getTime()).valueOf(),
            value: calculateSessionIncome(
              snapshotBeforeTimespan,
              mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
            ),
          },
        ];
      } else if (mode === 'netWorth') {
        snapshotDPBeforeTimespan = [
          {
            created: moment(new Date(snapshotBeforeTimespan.created).getTime()).valueOf(),
            value: getValueForSnapshot(snapshotBeforeTimespan),
          },
        ];
      } else {
        snapshotDPBeforeTimespan = [
          {
            created: moment(new Date(snapshotBeforeTimespan.created).getTime()).valueOf(),
            value: calculateSessionIncome(
              snapshotBeforeTimespan,
              mapSnapshotToApiSnapshot(this.snapshots[this.snapshots.length - 1])
            ),
          },
        ];
      }
    }

    // For reference series last index => Position left in chart; Index 0 => Positon right in chart;
    for (let i = series.length - 1; i >= 0; i--) {
      // const isIncomeSeries = (mode === 'both' && i % 2 === 1) || mode === 'income';
      // Get the prev snapshot value
      let prevSnapshotDatapoint: ISnapshotDataPoint | undefined;
      for (let j = i; j < series.length - seriesCount; j += seriesCount) {
        // Search in the series to the left (Before) for the prev snapshot in the series
        if (series[j + seriesCount].data.length > 2) {
          const lastSnapshotIndexInSeries = series[j + seriesCount].data.length - 2;
          // Net worth and income
          const seriesDataPoint = series[j + seriesCount].data[lastSnapshotIndexInSeries];
          prevSnapshotDatapoint = {
            uuid: seriesDataPoint.custom,
            created: seriesDataPoint.x,
            value: seriesDataPoint.y,
          };
          break;
        }
      }
      if (!prevSnapshotDatapoint && snapshotDPBeforeTimespan.length > 0) {
        if (mode !== 'both') {
          prevSnapshotDatapoint = snapshotDPBeforeTimespan[0];
        } else if (i % 2 === 0) {
          // Net worth
          prevSnapshotDatapoint = snapshotDPBeforeTimespan[0];
        } else if (i % 2 === 1) {
          // Income
          prevSnapshotDatapoint = snapshotDPBeforeTimespan[1];
        }
      }

      // Get the next snapshot value for within the timestamp and after
      let nextSnapshotDatapoint: ISnapshotDataPoint | undefined;
      for (let j = i - seriesCount; j >= -seriesCount; j -= seriesCount) {
        // Search in the series to the right (After) for the latest snapshot in the series
        if (series[j + seriesCount].data.length > 2) {
          // Net worth and income
          const seriesDataPoint = series[j + seriesCount].data[1];
          nextSnapshotDatapoint = { created: seriesDataPoint.x, value: seriesDataPoint.y };
          break;
        }
      }

      if (i + seriesCount < series.length) {
        // Set the net worth and income for the beginning of a series to the end of the previous series
        const prevSeries = series[i + seriesCount];
        if (prevSnapshotDatapoint && nextSnapshotDatapoint) {
          // Snapshot datapoint before and within the current series found -> Calc relative value
          series[i].data[0].y = +calculateRelativTimeStampValue(
            prevSnapshotDatapoint,
            series[i].data[0].x,
            nextSnapshotDatapoint
          ).toFixed(2);
          // Sync the datapoints - End from prev with start from current
          const lastDataIndex = prevSeries.data.length - 1;
          prevSeries.data[lastDataIndex].y = series[i].data[0].y;
        } else {
          series[i].data[0].y = prevSeries.data[prevSeries.data.length - 1].y;
        }
        if (prevSnapshotDatapoint?.uuid) {
          series[i].data[0].custom = prevSnapshotDatapoint.uuid;
          const lastDataIndex = prevSeries.data.length - 1;
          prevSeries.data[lastDataIndex].custom = prevSnapshotDatapoint.uuid;
        }
      } else {
        // Set startpoint of last index in the timespan (on the left)
        if (prevSnapshotDatapoint && nextSnapshotDatapoint) {
          // Snapshot datapoint before and within the current series found -> Calc relative value
          series[i].data[0].y = +calculateRelativTimeStampValue(
            prevSnapshotDatapoint, // snapshotDPBeforeTimespan
            series[i].data[0].x,
            nextSnapshotDatapoint
          ).toFixed(2);
        } else {
          // Sync the datapoints - No snapshot before but after = 0; Snapshot before but not after (Only timespan view) = current value
          if (prevSnapshotDatapoint) {
            series[i].data[0].y = +prevSnapshotDatapoint.value.toFixed(2);
          }
        }
        if (prevSnapshotDatapoint?.uuid) {
          series[i].data[0].custom = prevSnapshotDatapoint.uuid;
        }
      }

      // Set the end of the datapoint in advance. The values may get recalculated
      const lastIndex = series[i].data.length - 1;
      series[i].data[lastIndex].y = series[i].data[lastIndex - 1].y;
    }

    return series;
  }

  //#endregion Chart calculation

  @action
  removeSnapshots(snapshotIds: string[]) {
    this.snapshots = this.snapshots.filter((s) => !snapshotIds.find((id) => id === s.uuid));
  }
}
