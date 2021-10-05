import { useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useEffect } from 'react';
import { useStores } from '../..';
import DrawerWrapper from './DrawerWrapper';

type DrawerWrapperContainerProps = {
  children: ReactNode;
};

const DrawerWrapperContainer = ({ children }: DrawerWrapperContainerProps) => {
  const theme = useTheme();
  const { uiStateStore } = useStores();
  useEffect(() => {
    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, theme.transitions.duration.enteringScreen);
    return () => window.clearTimeout(t);
  }, [uiStateStore?.sidenavOpen, uiStateStore?.groupOverviewOpen]);

  return (
    <DrawerWrapper
      navMenuOpen={uiStateStore!.sidenavOpen}
      groupOverviewOpen={uiStateStore!.groupOverviewOpen}
    >
      {children}
    </DrawerWrapper>
  );
};

export default observer(DrawerWrapperContainer);
