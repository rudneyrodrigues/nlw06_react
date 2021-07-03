import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useParams, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question/index';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';
import checkImg from '../../assets/images/check.svg';
import answerImg from '../../assets/images/answer.svg';


import styles from './styles.module.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const { user, logoutWithGoogle } = useAuth();
  const history = useHistory();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })

      toast.success('Sala encerrada')
      history.push('/')
    }
  }

  async function removeQuestionInDatabase(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()

      toast.promise(
        removeQuestionInDatabase(questionId),
        {
          loading: 'Excluíndo',
          success: 'Pergunta excluída',
          error: 'Erro ao excluír pergunta'
        }
      )
      // toast.success('Pergunta excluída com sucesso')
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionIsAnswered = await (await database.ref(`rooms/${roomId}/questions/${questionId}/isAnswered`).get());
    

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !questionIsAnswered.val()
    })


    if (questionIsAnswered.val()) {
      toast.success('Pergunta marcada como não respondida')
    } else {
      toast.success('Pergunta marcada como respondida')
    }
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionIsHighlighted = await (await database.ref(`rooms/${roomId}/questions/${questionId}/isHighlighted`).get());

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !questionIsHighlighted.val()
    })
  }

  async function signOutGoogleAccount() {
    logoutWithGoogle();
    history.push(`/rooms/${roomId}`)
  }

  useEffect(() => {
    (async function () {
      try {
        const roomAuthor = await database.ref(`rooms/${roomId}/authorId`).get();

        if (roomAuthor.val() !== user?.id) {
          history.push(`/rooms/${roomId}`);
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
            
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>

            <Button onClick={signOutGoogleAccount}>Sair</Button>
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
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  hidden={question.isAnswered}
                >
                  <img src={checkImg} alt="Marcar pergunta como respondida" />
                </button>
                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                  hidden={question.isAnswered}
                >
                  <img src={answerImg} alt="Dar destaque a pergunta" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  );
};