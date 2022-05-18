import React, { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from 'firebase/auth';

import css from './App.module.scss';
import Button, { ButtonSize, ButtonVariant } from './components/button/Button';
import Tetris from 'components/tetris/Tetris';
import { auth, provider } from './index';
import { ReactComponent as TetrisHeader } from './svg/tetrisHeader.svg';

export default function App() {
  const [state, setState] = useState(false);

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem('token') ?? '{}');
    if (token.idToken) {
      signInWithCredential(
        auth,
        GoogleAuthProvider.credential(token.idToken, token.accessToken)
      ).then((result) => {
        setState(true);
      });
    }
  }, []);

  const authenticate = (): void => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;

        // The signed-in user info.
        const user = result.user;
        sessionStorage.setItem('token', JSON.stringify(credential));
        setState(true);
      })
      .catch((error) => {
        console.log('error', error.code, error.message);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        // The email of the user's account used.
        const email = error.email;

        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  if (!auth.currentUser) {
    return (
      <div className={css.Centered}>
        <main>
          <TetrisHeader className={css.Header} />
          <div className={css.SignIn}>
            <Button
              label={'Logg på'}
              onClick={authenticate}
              size={ButtonSize.XL}
              variant={ButtonVariant.Primary}
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main>
        <Tetris />
      </main>
    </div>
  );
}
