import React, { useEffect, useRef, useState } from 'react';
import { useStores } from '../..';
import { observer } from 'mobx-react-lite';
import { Profile } from '../../store/domains/profile';

const calculateTimeStr = (activeProfile: Profile | undefined) => {
  if (!activeProfile) return '00:00:00';
  return activeProfile.session.formattedSessionDuration;
};

const SessionStopwatch = () => {
  const { accountStore } = useStores();
  const activeProfile = accountStore!.getSelectedAccount.activeProfile;
  const intervalRef = useRef<NodeJS.Timeout>();
  const [timeStr, setTimeStr] = useState(() => calculateTimeStr(activeProfile));

  useEffect(() => {
    const start = () => {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => setTimeStr(calculateTimeStr(activeProfile)), 1000);
      }
    };

    const stop = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = undefined;
      setTimeStr('00:00:00');
    };

    const pause = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = undefined;
      setTimeStr(calculateTimeStr(activeProfile));
    };

    if (!activeProfile) return stop();

    if (
      activeProfile.session.sessionStarted &&
      !activeProfile.session.sessionPaused &&
      activeProfile.session.sessionStartedAt
    ) {
      start();
    } else if (activeProfile.session.sessionStarted && activeProfile.session.sessionPaused) {
      pause();
    } else {
      stop();
    }
    // Cleanup interval does not work here -> use as ref
  }, [
    activeProfile?.session.sessionStartedAt,
    activeProfile?.session.sessionStarted,
    activeProfile?.session.sessionPaused,
    activeProfile?.session.offsetPause,
    activeProfile?.session.offsetOffline,
    activeProfile?.session.offsetInactive,
    activeProfile?.session.offsetManualAdjustment,
  ]);

  useEffect(() => {
    return () => {
      // Cleanup inverval on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return <span>{timeStr}</span>;
};

export default observer(SessionStopwatch);
