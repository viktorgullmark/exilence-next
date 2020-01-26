import React, { useEffect } from 'react';
import { reaction, autorun, IReactionDisposer } from 'mobx';
import { UiStateStore } from '../../store/uiStateStore';
import { observer, inject } from 'mobx-react';
import { useHistory, useLocation } from 'react-router';

interface Props {
  uiStateStore?: UiStateStore;
}

const ReactionContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  const history = useHistory();
  const location = useLocation();

  const path = uiStateStore!.redirectedTo;
  if (path && path !== location.pathname) {
    history.push(path);
  }

  return null;
};

export default inject('uiStateStore')(observer(ReactionContainer));
