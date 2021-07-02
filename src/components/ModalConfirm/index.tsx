import Modal from 'react-modal';

type ModalConfirmProps = {
  isOpen: boolean;
}

export function ModalConfirm({isOpen}: ModalConfirmProps) {
  return (
    <Modal
      isOpen={isOpen}
    >
      <h1>Ola mundo</h1>
    </Modal>
  )
}