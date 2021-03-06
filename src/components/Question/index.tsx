import { ReactNode } from 'react';
import styles from './styles.module.scss';

type QuestionProps = {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  }
  isAnswered?: boolean;
  isHighlighted?: boolean;
  children?: ReactNode;
}

export function Question({
  author,
  content,
  children,
  isHighlighted = false,
  isAnswered = false
}: QuestionProps) {
  return (
    <div className={
      `${styles.question}
      ${isAnswered ? `${styles.answered}` : ''}
      ${isHighlighted && !isAnswered ? `${styles.highlighted}` : ''}
      `}>
      <p>{content}</p>
      <footer>
        <div className={styles.userInfo}>
          <img src={author.avatar} alt={author.name} />
          <span>{author.name}</span>
        </div>
        <div>
          {children}
        </div>
      </footer>
    </div>
  );
}