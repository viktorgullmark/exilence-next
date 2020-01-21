import React from 'react';
import { observer, inject } from 'mobx-react';
import { UiStateStore } from '../../store/uiStateStore';
import DrawerWrapper from './DrawerWrapper';

interface DrawerWrapperContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  uiStateStore?: UiStateStore;
}

const DrawerWrapperContainer: React.FC<DrawerWrapperContainerProps> = ({
  uiStateStore,
  children
}: DrawerWrapperContainerProps) => {
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
