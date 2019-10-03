import React from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';
import { useStateValue } from '../../state';
import { withSubscription } from '../with-subscription/WithSubscription';
import Header from './Header';

const destroy$: Subject<boolean> = new Subject<boolean>();

const HeaderContainer: React.FC = () => {

  const [, dispatch] = useStateValue();
  const history = useHistory();

  return (
    <Header></Header>
  );
}

export default withSubscription(HeaderContainer, destroy$);
