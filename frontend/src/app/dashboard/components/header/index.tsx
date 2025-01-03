'use client';

import { useState, useRef } from "react";
import Link from "next/link";
import styles from "./styles.module.scss";
import Image from "next/image";
import { Bell, LogOutIcon, X } from "lucide-react";
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Modal from "react-bootstrap/Modal";
import stylesModal from "./stylesModal.module.scss";
import useF2Redirect from "@/app/hooks/useF2Redirect";
import { useMenu } from "@/app/context/MenuContext";
import { BeatLoader } from "react-spinners";

import Notifications from '../../components/header/components/notification'; // Importe o componente

export function Header() {
  useF2Redirect(); // Usando o hook para usar F2 Início
  const { setSelected } = useMenu(); // Acessando o contexto do menu
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState<number>(5);
  const [showNotifications, setShowNotifications] = useState<boolean>(false); // Controla se as notificações serão mostradas
  const [showModal, setShowModal] = useState<boolean>(false); // Controla se o modal de logout será mostrado
  const router = useRouter();

  const handleLogout = () => {
    setIsLoading(true); // Ativa o estado de loading
    deleteCookie("token", { path: "/" });
    localStorage.removeItem("selectedMenuItem");
    setIsLoading(false); // Desativa o estado de loading
    setShowModal(false); // Fecha o modal de logout
    router.replace("/"); // Redireciona para a página inicial
  };

  const handleOpenNotifications = () => {
    setShowNotifications(prevState => !prevState); // Alterna a visibilidade das notificações
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fecha o modal de logout
  };

  const handleLogoClick = () => {
    setSelected("/"); // Atualiza o contexto para o item "Início"
  };

  return (
    <>
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href="/dashboard" onClick={handleLogoClick}>
            <Image
              alt="Logo Frigorifico"
              src={"/LOGOVERTICAL.png"}
              width={167}
              height={63}
              priority={true}
              quality={100}
            />
          </Link>

          <nav>
            {/* Ícone de Notificação */}
            <a onClick={handleOpenNotifications} className={styles.logoutLink}>
              <div className={styles.bellContainer}>
                <Bell size={22} color="#FFF" />
                {notificationCount > 0 && (
                  <span className={styles.notificationCount}>{notificationCount}</span>
                )}
              </div>
            </a>
            
            {/* Ícone de Logout */}
            <div onClick={() => { 
              console.log("Abrindo o modal de logout..."); // Verifica se o clique está sendo registrado
              setShowModal(true); 
            }} className={styles.logoutLink}>
              <LogOutIcon size={22} color="#FFF" />
            </div>
          </nav>
        </div>
      </header>

      {/* Usando o componente Notifications */}
      <Notifications 
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notificationCount={notificationCount}
      />

      {/* Modal de Logout */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        className={stylesModal.customModal}
        size="sm"
        aria-labelledby="logout-modal"
      >
        <div className={stylesModal.customModalHeader}>
          <h2>Deseja realmente sair?</h2>
          <button onClick={handleCloseModal} className={stylesModal.closeButton}>
            <X size={24} color="var(--white)" />
          </button>
        </div>
        <div className={stylesModal.customModalBody}>
          <div className={stylesModal.buttonContainer}>
            <button
              onClick={handleLogout}
              className={stylesModal.customBtnPrimary}
            >
              {isLoading ? <BeatLoader color="#fff" size={6} /> : "Sair"}
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
