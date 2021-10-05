import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router';
import { useStores } from '../..';

const ReactionContainer = () => {
  const { routeStore } = useStores();
  const history = useHistory();
  const location = useLocation();

  const path = routeStore!.redirectedTo;
  if (path && path !== location.pathname) {
    history.push(path);
  }

  return null;
};

export default observer(ReactionContainer);
