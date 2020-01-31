import { inject, observer } from 'mobx-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { RouteStore } from '../../store/routeStore';

interface Props {
  routeStore?: RouteStore;
}

const ReactionContainer: React.FC<Props> = ({ routeStore }: Props) => {
  const history = useHistory();
  const location = useLocation();

  const path = routeStore!.redirectedTo;
  if (path && path !== location.pathname) {
    history.push(path);
  }

  return null;
};

export default inject('routeStore')(observer(ReactionContainer));
