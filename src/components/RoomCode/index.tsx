import toast from 'react-hot-toast';
import copyImg from '../../assets/images/copy.svg';

import styles from './styles.module.scss';

type RoomCodeProps = {
  code: string;
}

export function RoomCode({ code }: RoomCodeProps) {
  function copyRoomCodeToClipboar() {
    navigator.clipboard.writeText(code);
    toast.success('Copiado para a área de transferência');
  }

  return (
    <button
      className={styles.roomCode}
      onClick={copyRoomCodeToClipboar}
    >
      <div>
        <img src={copyImg} alt="Copiar" />
      </div>
      <span>Sala #{code}</span>
    </button>
  );
}