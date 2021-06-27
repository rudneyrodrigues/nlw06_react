import { useParams, useHistory } from 'react-router-dom';
import { FormEvent, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { useAuth } from '../../hooks/useAuth';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';

import styles from './styles.module.scss';

type RoomParams = {
  id: string;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
}>

type Question = {
  id: string;
  author: {
    name: string,
    avatar: string
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;

}

export function Room() {
  const { user, logoutWithGoogle, signInWithGoogle } = useAuth()
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const history = useHistory();

  const roomId = params.id;

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', room => {
      const databaseRoom = room.val();
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      });

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions);
    });
  }, [roomId])

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault();

    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      toast.error('Faça login para enviar a pergunta');
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user?.name,
        avatar: user?.avatar
      },
      isHighlighted: false, // Se a pergunta está com destaque
      isAnswered: false // Se a pergunta já foi respondida
    }

    await database.ref(`rooms/${roomId}/questions`).push(question);
    toast.success('Pergunta adicionada');
    setNewQuestion('');
  }

  return (
    <div id={styles.pageRoom}>
      <header>
        <div className={styles.content}>
          <img
            src={logoImg}
            alt="Letmeask"
            onClick={() => {history.push('/')}}
          />
          <div>
            <RoomCode code={roomId} />
            {user ? (
              <button className={styles.logout} onClick={logoutWithGoogle}>Sair</button>
            ) : (
              ''
            )}
          </div>
        </div>
      </header>

      <main>
        <div className={styles.roomTitle}>
          <h1>Sala {title}</h1>
          {questions.length <= 1 ? (
            <span>
              {questions.length} pergunta
            </span>
          ) : (
            <span>
              {questions.length} perguntas
            </span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que você quer perguntar?"
            onChange={e => setNewQuestion(e.target.value)}
            value={newQuestion}
            required
          />

          <div className={styles.formFooter}>
            {user ? (
              <p><img src={user.avatar} alt={user.name} /> {user.name}</p>
            ) : (
              <span>
                Para enviar uma pergunta, <button
                  type="button"
                  onClick={signInWithGoogle}
                >faça seu login</button>.
              </span>
            )}
            
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
      </main>
    </div>
  );
};