import { Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useEffect, useState } from 'react';
import { useStores } from '../..';

type CountdownTimerProps = {
  comparison: number;
};

const CountdownTimer = ({ comparison }: CountdownTimerProps) => {
  const { rateLimitStore } = useStores();
  const calculateTimeLeft = () => {
    const difference = comparison - +new Date();
    let timeLeft = 0;

    if (difference > 0) {
      timeLeft = Math.floor(difference / 1000);
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
      if (timeLeft === 0) {
        rateLimitStore.setRetryAfter(0);
      }
    }, 1000);
  });

  return <Typography variant="caption">{timeLeft} seconds</Typography>;
};

export default observer(CountdownTimer);
