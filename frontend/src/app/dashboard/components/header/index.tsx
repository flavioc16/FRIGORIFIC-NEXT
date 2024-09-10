// src/app/dashboard/components/yourComponent.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './styles.module.scss'; // Ajuste o caminho conforme necessário
import Image from 'next/image';
import { LogOutIcon, X } from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import Modal from 'react-bootstrap/Modal';

import stylesModal from './stylesModal.module.scss'; // Ajuste o caminho conforme necessári

import LOGOVERTICAL from '/public/LOGOVERTICAL.png';

export function Header() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    deleteCookie('token', { path: '/' });
    localStorage.removeItem('selectedMenuItem');
    router.replace('/');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
            <a onClick={handleOpenModal} className={styles.logoutLink}>
              <LogOutIcon size={22} color="#FFF" />
            </a>
          </nav>
        </div>
      </header>

      {/* Modal personalizado */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className={stylesModal.customModal}
        size="sm"
      >
        <div className={stylesModal.customModalHeader}>
          <h2>Deseja realmente sair?</h2>
          <button onClick={handleCloseModal} className={stylesModal.closeButton}>
            <X size={24} color="var(--white)" /> {/* Ícone de fechar */}
          </button>
        </div>
        <div className={stylesModal.customModalBody}>
          <div className={stylesModal.buttonContainer}>
            <button onClick={handleLogout} className={stylesModal.customBtnPrimary}>
              Sair
            </button>
            <button onClick={handleCloseModal} className={stylesModal.customBtnSecondary}>
              Cancelar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
