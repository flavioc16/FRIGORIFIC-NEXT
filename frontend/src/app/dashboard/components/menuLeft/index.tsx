"use client"
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, House, Sun, Eye, CalendarCheck, X, Search } from 'lucide-react';
import styles from './styles.module.scss';
import { useMenu } from '@/app/context/MenuContext';
import { MenuItemId } from '@/app/types/menu';

const menuItems: { id: MenuItemId, label: string, icon: JSX.Element }[] = [
  { id: '/', label: 'Inicio [f2]', icon: <House /> },
  { id: 'clients', label: 'Clientes', icon: <User /> },
  { id: 'settings', label: 'Account', icon: <Settings /> },
  { id: 'appearance', label: 'Appearance', icon: <Sun /> },
  { id: 'reports', label: 'Relatórios', icon: <CalendarCheck /> },
  { id: 'visibility', label: 'Visibility', icon: <Eye /> },
];

export default function MenuLeft() {
  const { selected, setSelected } = useMenu();
  const [searchTerm, setSearchTerm] = React.useState('');
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [isMenuInputFocused, setIsMenuInputFocused] = React.useState(false);

  const handleClick = (id: MenuItemId) => {
    setSelected(id);
  };

  const handleSearchClear = () => setSearchTerm('');

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  

  // Limpa o termo de pesquisa quando a tecla Escape é pressionada, se o campo de entrada estiver focado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuInputFocused) {
        setSearchTerm('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuInputFocused]);

  // Atualiza o estado de foco do campo de entrada
  useEffect(() => {
    const handleFocus = () => setIsMenuInputFocused(true);
    const handleBlur = () => setIsMenuInputFocused(false);

    const inputElement = menuInputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  return (
    <div className={styles.menu}>
      <nav>
        <div className={styles.input}>
          <input
            ref={menuInputRef}
            id="menuSearchInput"
            type="text"
            placeholder="Consultar menu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.filterInput}
          />
          {searchTerm ? (
            <X className={styles.clearIcon} onClick={handleSearchClear} />
          ) : (
            <Search className={styles.searchIcon} />
          )}
        </div>
        <div className={styles.menuItems}>
          {filteredMenuItems.map(item => (
            <Link
              key={item.id}
              href={`/dashboard/${item.id}`}
              className={`${styles.value} ${selected === item.id ? styles.selected : ''}`}
              onClick={() => handleClick(item.id)}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
