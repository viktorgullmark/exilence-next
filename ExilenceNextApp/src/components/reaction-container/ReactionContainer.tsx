import { useHistory, useLocation } from 'react-router';
import { inject, observer } from 'mobx-react';

import { RouteStore } from '../../store/routeStore';

type ReactionContainerProps = {
  routeStore?: RouteStore;
};

const ReactionContainer = ({ routeStore }: ReactionContainerProps) => {
  const history = useHistory();
  const location = useLocation();

  const path = routeStore!.redirectedTo;
  if (path && path !== location.pathname) {
    history.push(path);
  }

  return null;
};

export default inject('routeStore')(observer(ReactionContainer));
