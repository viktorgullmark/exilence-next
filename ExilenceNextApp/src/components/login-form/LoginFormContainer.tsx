import React from 'react';
import { useHistory } from 'react-router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import useFormInput from '../../helpers/custom-hooks';
import { userService } from '../../services/user.service';
import { withSubscription } from '../with-subscription/WithSubscription';
import LoginForm from './LoginForm';
import { useStateValue } from '../../state';

const destroy$: Subject<boolean> = new Subject<boolean>();

const LoginFormContainer: React.FC = () => {

  const username = useFormInput('');
  const password = useFormInput('');

  const [, dispatch] = useStateValue();
  const history = useHistory();

  function handleLogin(event: any) {
    if (event) {
      event.preventDefault();
    }

    userService.login(username.value, password.value).pipe(takeUntil(destroy$))
      .subscribe((user: any) => {
        dispatch({
          type: 'login',
          setUser: { user: user }
        })
        history.push('/admin')
      });
  }

  return (
    <LoginForm handleLogin={(event: any) => handleLogin(event)} username={username} password={password}></LoginForm>
  );
}

export default withSubscription(LoginFormContainer, destroy$);
