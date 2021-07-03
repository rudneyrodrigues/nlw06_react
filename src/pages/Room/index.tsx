import { useParams, useHistory } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question/index';
import { useAuth } from '../../hooks/useAuth';
import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';

import logoImg from '../../assets/images/logo.svg';

import styles from './styles.module.scss';

type RoomParams = {
  id: string;
}

export function Room() {
  const { user, logoutWithGoogle, signInWithGoogle } = useAuth()
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  
  const history = useHistory();
  
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

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

  async function handleLikeQuestion(questionId:string, likeId: string | undefined) {
    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (likeId) {
      // Remover like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();

      toast.error('Pergunta removida como Gostei')
    } else {
      // Dar like
      await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
        authorId: user?.id,
        authorName: user?.name
      });
  
      toast.success('Pergunta marcada como Gostei');
    }
  }

  useEffect(() => {
    (async function () {
      try {
        const roomRef = await database.ref(`rooms/${roomId}`).get();
        if (roomRef.val().endedAt) {
          toast.error('Esta sala foi encerada.');
          history.push('/');
        }

        const roomAuthor = await database.ref(`rooms/${roomId}/authorId`).get();
        if (roomAuthor.val() === user?.id) {
          history.push(`/admin/rooms/${roomId}`);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [history, user?.id, roomId])

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
              <Button onClick={logoutWithGoogle}>Sair</Button>
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

        <div className={styles.questionsContainer}>
          {questions.map(question => {
            return (
              <Question
                id={question.id}
                author={question.author}
                content={question.content}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
                key={question.id}
              >
                {(!question.isAnswered) ? (
                  <button
                    type="button"
                    className={`${styles.likeButton} ${question.likeId ? `${styles.liked}`: ''}`}
                    // "arial-label" Atributo de acessibilidade
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    { question.likeCount > 0 && <span>{question.likeCount}</span> }
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : ''}
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
};