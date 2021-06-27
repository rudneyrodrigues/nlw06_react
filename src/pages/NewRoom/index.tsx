import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';

import { Aside } from '../../components/Aside';
import { Button } from '../../components/Button';
import { database } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

import logoImg from '../../assets/images/logo.svg';

import styles from './styles.module.scss';

export function NewRoom() {
  const { user } = useAuth();
  const history = useHistory();
  const [room, setRoom] = useState('');

  function handleCreateNewRoom(e: FormEvent) {
    e.preventDefault();

    if (room.trim() === '') {
      return;
    }

    const roomRef = database.ref('rooms');

    const firebaseRoom = roomRef.push({
      title: room,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id={styles.newRoom}>
      <Aside />

      <main>
        <div className={styles.mainContent}>
          <img src={logoImg} alt="Logo Let me ask" />

          <h2>Criar uma nova sala</h2>

          <form onSubmit={handleCreateNewRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(e) => {setRoom(e.target.value)}}
              value={room}
              required
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