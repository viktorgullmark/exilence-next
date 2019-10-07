import React from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';

import useFormInput from '../../hooks/useFormInput';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginStepper from './LoginStepper';
import { useSelector, useDispatch } from 'react-redux';
import { AppState } from '../../store';
import { SessionActionTypes } from '../../store/session/types';
import { ApplicationSession } from './../../interfaces/application-session.interface';

const destroy$: Subject<boolean> = new Subject<boolean>();

const LoginStepperContainer: React.FC = () => {

  const session = useSelector((state: AppState) => state.session);
  const dispatch = useDispatch()

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const history = useHistory();

  function handleLogin(event: any) {
    if (event) {
      event.preventDefault();
    }

    dispatch({ type: 'INIT_SESSION', payload: { account: 'test' } as ApplicationSession } as SessionActionTypes)
  }

  return (
    <LoginStepper handleLogin={(event: any) => handleLogin(event)} accountName={accountName} sessionId={sessionId}></LoginStepper>
  );
}

export default withSubscription(LoginStepperContainer, destroy$);
