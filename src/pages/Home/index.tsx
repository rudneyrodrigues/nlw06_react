import { FormEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import { Aside } from '../../components/Aside';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import styles from './styles.module.scss';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }
  
  return (
    <div id={styles.pageAuth}>
      <Aside />

      <main>
        <div className={styles.mainContent}>
          <img src={logoImg} alt="Logo Let me ask" />
          <button className={styles.createRoom} onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>

          <div className={styles.separator}>ou entre em uma sala</div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Digite o código da sala"
            />
            <Button type="submit">
              <FiLogIn />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}