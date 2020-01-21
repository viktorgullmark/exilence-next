import React from 'react';
import { reaction } from 'mobx';
import { UiStateStore } from '../../store/uiStateStore';
import { observer, inject } from 'mobx-react';
import { useHistory, useLocation } from 'react-router';

interface Props {
  uiStateStore?: UiStateStore;
}

const ReactionContainer: React.FC<Props> = ({ uiStateStore }: Props) => {
  const history = useHistory();
  const location = useLocation();

  reaction(
    () => uiStateStore!.validated,
    (_data, reaction) => {
      if (!_data && location.pathname !== '/login') {
        history.push('/login');
      }
      reaction.dispose();
    }
  );

  reaction(
    () => uiStateStore!.redirectedTo,
    (_path, reaction) => {
      if (_path && location.pathname !== _path) {
        history.push(_path);
      }
      reaction.dispose();
    }
  );


  return null;
};

export default inject('uiStateStore')(observer(ReactionContainer));
