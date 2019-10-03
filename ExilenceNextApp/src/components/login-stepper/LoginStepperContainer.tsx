import React from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import useFormInput from '../../hooks/custom-hooks';
import { userService } from '../../services/user.service';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginStepper from './LoginStepper';
import { useStateValue } from '../../state';

const destroy$: Subject<boolean> = new Subject<boolean>();

const LoginStepperContainer: React.FC = () => {

  const accountName = useFormInput('');
  const sessionId = useFormInput('');

  const [, dispatch] = useStateValue();
  const history = useHistory();

  function handleLogin(event: any) {
    if (event) {
      event.preventDefault();
    }

    userService.login(accountName.value, sessionId.value).pipe(takeUntil(destroy$))
      .subscribe((user: any) => {
        dispatch({
          type: 'login',
          setUser: { user: user }
        })
        history.push('/admin')
      });
  }

  return (
    <LoginStepper handleLogin={(event: any) => handleLogin(event)} accountName={accountName} sessionId={sessionId}></LoginStepper>
  );
}

export default withSubscription(LoginStepperContainer, destroy$);
