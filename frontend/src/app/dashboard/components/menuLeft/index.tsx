"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, House, Sun, Eye, Accessibility, X, Search } from 'lucide-react'; // Adicione o ícone de busca e limpar
import styles from './styles.module.scss';
import { useFocus } from '@/app/context/FocusContext';

type MenuItemId = '/' | 'clients' | 'settings' | 'appearance' | 'accessibility' | 'visibility';

const menuItems: { id: MenuItemId, label: string, icon: JSX.Element }[] = [
  { id: '/', label: 'Inicio [f2]', icon: <House /> },
  { id: 'clients', label: 'Clientes', icon: <User /> },
  { id: 'settings', label: 'Account', icon: <Settings /> },
  { id: 'appearance', label: 'Appearance', icon: <Sun /> },
  { id: 'accessibility', label: 'Accessibility', icon: <Accessibility /> },
  { id: 'visibility', label: 'Visibility', icon: <Eye /> },
];

export default function MenuLeft() {
  const { isMenuInputFocused, setIsMenuInputFocused } = useFocus();
  const [selected, setSelected] = useState<MenuItemId>('/');
  const [searchTerm, setSearchTerm] = useState('');
  const menuInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleFocus = () => setIsMenuInputFocused(true);
    const handleBlur = () => setIsMenuInputFocused(false);

    const menuInput = menuInputRef.current;
    if (menuInput) {
      menuInput.addEventListener('focus', handleFocus);
      menuInput.addEventListener('blur', handleBlur);

      return () => {
        menuInput.removeEventListener('focus', handleFocus);
        menuInput.removeEventListener('blur', handleBlur);
      };
    }
  }, [setIsMenuInputFocused]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSearchTerm(''); // Clear the search term
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClick = (id: MenuItemId) => {
    setSelected(id);
  };

  const handleSearchClear = () => setSearchTerm('');

  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
