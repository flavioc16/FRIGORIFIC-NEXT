// src/app/dashboard/components/yourComponent.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss'; // Ajuste o caminho conforme necessário
import Image from 'next/image';
import { LogOutIcon } from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';

import stylesModal from './stylesModal.module.scss'; // Ajuste o caminho conforme necessári

import LOGOVERTICAL from '/public/LOGOVERTICAL.png';
import { tree } from 'next/dist/build/templates/app-page';

export function Header() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token', { path: '/' });
    localStorage.removeItem('selectedMenuItem');
    router.replace('/');
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/dashboard">
            <Image
              alt="Logo Frigorifico"
              src={LOGOVERTICAL}
              width={167}
              height={63}
              priority={true}
              quality={100}
            />
          </Link>

          <nav>
            <Link href="/dashboard/clients">Clientes</Link>
            <a onClick={handleShow} className={styles.logoutLink}>
              <LogOutIcon size={22} color="#FFF" />
            </a>
          </nav>
        </div>
      </header>

      <Modal
        show={showModal}
        onHide={handleClose}
        animation={false}
        size='sm'
        keyboard={true}
        dialogClassName={stylesModal.customModalContent}
      >
        <Modal.Header className={stylesModal.customModalHeader}>
          <Modal.Title className={stylesModal.customModalTitle}>Deseja realmente sair?</Modal.Title>
        </Modal.Header>
        <Modal.Body className={stylesModal.customModalBody} onClick={handleLogout}>
          <a onClick={handleLogout} className={stylesModal.customBtnPrimary}>
            Sair
          </a>
        </Modal.Body>
        <Modal.Footer className={stylesModal.customModalFooter} onClick={handleClose} >
          <a onClick={handleClose} className={stylesModal.customBtnSecondary}>
            Cancelar
          </a>
        </Modal.Footer>
      </Modal>
    </>
  );
}
