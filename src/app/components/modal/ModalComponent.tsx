// src/components/Modal.tsx
import React from 'react';
import styles from './ModalComponent.module.css'; 

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} title='Close Modal' aria-label="Close">X</button>
        {children}
      </div>
    </div>
  );
};



export default Modal;
