import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
// import { useContext } from 'react';

import { Aside } from '../../components/Aside';
import { Button } from '../../components/Button';
// import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';

import styles from './styles.module.scss';

export function NewRoom() {
  // const { user } = useAuth();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
  }

  return (
    <div id={styles.newRoom}>
      <Aside />

      <main>
        <div className={styles.mainContent}>
          <img src={logoImg} alt="Logo Let me ask" />

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nome da sala"
            />
            <Button type="submit">
              <FiLogIn />
              Criar sala
            </Button>
          </form>

          <p>
            Quer entrar em uma sala existente?
            <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}