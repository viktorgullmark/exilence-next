import React from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';

import useFormInput from '../../hooks/useFormInput';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginStepper from './LoginStepper';

const destroy$: Subject<boolean> = new Subject<boolean>();

const LoginStepperContainer: React.FC = () => {

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const history = useHistory();

  function handleLogin(event: any) {
    if (event) {
      event.preventDefault();
    }
  }

  return (
    <LoginStepper handleLogin={(event: any) => handleLogin(event)} accountName={accountName} sessionId={sessionId}></LoginStepper>
  );
}

export default withSubscription(LoginStepperContainer, destroy$);
