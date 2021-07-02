import { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { Aside } from '../../components/Aside';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';
import googleIconImg from '../../assets/images/google-icon.svg';

import styles from './styles.module.scss';

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle();
    }

    history.push('/rooms/new');
  }

  async function handleJoinRoom(e: FormEvent) {
    e.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('A sala não existe.');
      return;
    }

    if (roomRef.val().endedAt) {
      toast.error('Esta sala já foi encerada.');
      return;
    }

    history.push(`/rooms/${roomCode}`)
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

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={e => setRoomCode(e.target.value)}
              value={roomCode}
              required
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