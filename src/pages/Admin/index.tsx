import { useParams, useHistory } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useRoom } from '../../hooks/useRoom';
import { database } from '../../services/firebase';
import { Button } from '../../components/Button';
import { RoomCode } from '../../components/RoomCode';
import { Question } from '../../components/Question/index';

import logoImg from '../../assets/images/logo.svg';
import deleteImg from '../../assets/images/delete.svg';


import styles from './styles.module.scss';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>();
  const history = useHistory();
  const roomId = params.id;

  const { questions, title } = useRoom(roomId);

  async function handleEndRoom() {
    if (window.confirm('Tem certeza que deseja encerrar a sala?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date()
      })
    }

    toast.success('Sala encerrada')
    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()

      toast.success('Pergunta excluída com sucesso')
    }
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
            
            <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
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