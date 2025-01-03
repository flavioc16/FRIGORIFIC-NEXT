import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { Bell, CircleAlert, TriangleAlert } from 'lucide-react';
import Link from 'next/link'; // Importe o Link do Next.js

interface NotificationsProps {
  showNotifications: boolean;
  setShowNotifications: React.Dispatch<React.SetStateAction<boolean>>;
  notificationCount: number;
}

const Notifications: React.FC<NotificationsProps> = ({ showNotifications, setShowNotifications, notificationCount }) => {
  const notificationsRef = useRef<HTMLDivElement | null>(null);

  // Corrigido: useState para o status da notificação
  const [status, setStatus] = useState(0); // 0 = não lida, 1 = lida

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false); // Fecha as notificações
      }
    };

    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications, setShowNotifications]);

  if (!showNotifications) return null;

  // Função para fechar as notificações
  const handleNotificationClick = () => {
    setShowNotifications(false); // Fecha as notificações
  };

  return (
    <div className={styles.notificationsContainer} ref={notificationsRef}>
      {/* Cabeçalho das Notificações */}
      <div className={styles.notificationsHeader}>
        <h6>Central de Notificações</h6>
      </div>

      {/* Lista de Notificações */}
      <Link href="#">
        <div className={styles.notificationItem}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircleBgInfo}>
              <Bell size={22} color="#FFF" />
            </div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTitle}>Lembrete Promocional</div>
            <span className={styles.notificationDescription}>Sua descrição do lembrete aqui</span>
            <div className={styles.notificationDate}>Data do lembrete: 10/12/2024</div>
            {status === 0 && <div className={styles.unreadDot}></div>} {/* Bolinha azul se o status for 0 */}
          </div>
        </div>
      </Link>

      <Link href="/dashboard/reminders" onClick={handleNotificationClick}>
        <div className={styles.notificationItem}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircleBgPrimary}>
              <CircleAlert size={22} color="#FFF" />
            </div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTitle}>Encomenda para Hoje</div>
            <span className={styles.notificationDescription}>Detalhes da encomenda</span>
            <div className={styles.notificationDate}>Data da encomenda: 10/12/2024</div>
            {status === 0 && <div className={styles.unreadDot}></div>} {/* Bolinha azul se o status for 0 */}
          </div>
        </div>
      </Link>

      <Link href="/dashboard/purchases/58d14dcd-9985-4877-8583-7da782b12809" onClick={handleNotificationClick}>
        <div className={styles.notificationItem}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircleBgDanger}>
              <TriangleAlert size={20} color="#FFF" />
            </div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTitle}>Marcos Aurelié Sousa de Castro</div>
            <div className={styles.notificationDetails}>
              <span className={styles.notificationAmount}>Juros aplicados em compras vencidas</span>
              <div className={styles.notificationDate}>Data de vencimento: 10/12/2024</div>
              {status === 0 && <div className={styles.unreadDot}></div>} {/* Bolinha azul se o status for 0 */}
            </div>
          </div>
        </div>
      </Link>

      <Link href="/dashboard/purchases/88133c94-6539-485c-b24a-dbe4154ca909" onClick={handleNotificationClick}>
        <div className={styles.notificationItem}>
          <div className={styles.iconContainer}>
            <div className={styles.iconCircleBgDanger}>
              <TriangleAlert size={20} color="#FFF" />
            </div>
          </div>
          <div className={styles.notificationText}>
            <div className={styles.notificationTitle}>Flavio Sousa De Castro</div>
            <div className={styles.notificationDetails}>
              <span className={styles.notificationAmount}>Juros aplicados em compras vencidas</span>
              <div className={styles.notificationDate}>Data de vencimento: 10/12/2024</div>
              {status === 0 && <div className={styles.unreadDot}></div>} {/* Bolinha azul se o status for 0 */}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Notifications;
