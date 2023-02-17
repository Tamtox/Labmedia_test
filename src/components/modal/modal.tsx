import '@/components/modal/modal.scss';

import { useEffect, useRef } from 'react';

import Button from '@/components/button/button';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  userId: string;
  deleteUser: (userId: string) => void;
};

const Modal = ({ open, onClose, userId, deleteUser }: ModalProps): JSX.Element => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const eventListener = (event: any) => {
      if (!modalRef.current || modalRef.current.contains(event.target)) {
        return;
      }
      // open && onClose();
    };
    document.addEventListener('click', eventListener);
    return () => {
      document.removeEventListener('click', eventListener);
    };
  }, [modalRef, onClose]);
  return (
    <div className="modal__background">
      <div className={`modal color--bg--white`} ref={modalRef}>
        <p className={`modal__text`}>Вы уверены, что хотите удалить пользователя?</p>
        <div className={`modal__buttons`}>
          <Button
            className={`modal__buttons__accept`}
            onClick={() => {
              deleteUser(userId);
              onClose();
            }}
          >
            Да
          </Button>
          <Button onClick={onClose}>Нет</Button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
