import { reaction } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import { IAccount } from '../../interfaces/account.interface';
import { AccountStore } from '../../store/accountStore';
import { UiStateStore } from '../../store/uiStateStore';
import LoginContent from './LoginContent';
import { LeagueStore } from './../../store/leagueStore';
import { electronService } from '../../services/electron.service';
import AppConfig from './../../config/app.config';

interface LoginContentProps {
  accountStore?: AccountStore;
  uiStateStore?: UiStateStore;
  leagueStore?: LeagueStore;
}

const LoginContentContainer: React.FC<LoginContentProps> = ({
  accountStore,
  uiStateStore,
  leagueStore
}: LoginContentProps) => {
  const history = useHistory();
  const location = useLocation();

  uiStateStore!.setValidated(false);

  const handleValidate = (details: IAccount) => {
    accountStore!.initSession(location.pathname, {
      sessionId: details.sessionId
    });

    reaction(
      () => uiStateStore!.validated,
      (_cookie, reaction) => {
        history.push('/net-worth');
        reaction.dispose();
      }
    );
  };

  const handleOAuth = () => {
    var options = {
      clientId: 'exilence',
      scopes: ['profile'], // Scopes limit access for OAuth tokens.
      redirectUrl: 'http://localhost',
      state: 'yourstate',
      responseType: 'code'
    };

    var authWindow = new electronService.remote.BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      'node-integration': false
    });

    var authUrl = `https://www.pathofexile.com/oauth/authorize?client_id=${options.clientId}&response_type=${options.responseType}&scope=${options.scopes}&state=${options.state}&redirect_uri=${options.redirectUrl}`;

    function handleCallback(url: string) {
      var raw_code = /code=([^&]*)/.exec(url) || null;
      var code = raw_code && raw_code.length > 1 ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(url);

      if (code || error) {
        // Close the browser if code found or error
        authWindow.destroy();
      }

      // If there is a code, proceed to get token from github
      if (code) {
        accountStore!.loginWithOAuth(code);
      } else if (error) {
        alert(
          "Oops! Something went wrong and we couldn't" +
            'log you in using Github. Please try again.'
        );
      }
    }

    // Handle the response from GitHub - See Update from 4/12/2015

    authWindow.webContents.on('will-navigate', function(event: any, url: any) {
      handleCallback(url);
    });

    authWindow.webContents.on('will-redirect', function(event: any, url: any) {
      handleCallback(url);
    });

    authWindow.webContents.on('did-get-redirect-request', function(
      event: any,
      oldUrl: any,
      newUrl: any
    ) {
      handleCallback(newUrl);
    });

    // Reset the authWindow on close
    authWindow.on(
      'close',
      function() {
        authWindow = null;
      },
      false
    );

    authWindow.loadURL(authUrl);
    authWindow.show();
  };

  return (
    <LoginContent
      handleOAuth={() => handleOAuth()}
      handleValidate={(details: IAccount) => handleValidate(details)}
      isSubmitting={uiStateStore!.isSubmitting}
      account={accountStore!.getSelectedAccount}
    ></LoginContent>
  );
};

export default inject(
  'accountStore',
  'uiStateStore',
  'leagueStore'
)(observer(LoginContentContainer));
