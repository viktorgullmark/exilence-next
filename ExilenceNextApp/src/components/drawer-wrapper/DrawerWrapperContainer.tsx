import React, { useEffect } from 'react';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';
import DrawerWrapper from './DrawerWrapper';
import { useTheme } from '@material-ui/core';

interface DrawerWrapperContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
}

const DrawerWrapperContainer: React.FC<DrawerWrapperContainerProps> = ({
  uiStateStore,
  children
}: DrawerWrapperContainerProps) => {
  const theme = useTheme();

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

export default inject('uiStateStore')(observer(DrawerWrapperContainer));
