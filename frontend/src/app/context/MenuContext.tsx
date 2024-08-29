"use client"
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

import { MenuContextType, MenuItemId } from '../types/menu';


const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selected, setSelected] = useState<MenuItemId | null>(null); // Inicialize como null

  useEffect(() => {
    // Recuperar o valor do localStorage
    const savedSelection = localStorage.getItem('selectedMenuItem') as MenuItemId | null;
    // Verificar se o valor recuperado é válido
    if (savedSelection && ['/', 
      'clients', 
      'products', 
      'reminders', 
      'reports', 
      'moneybox'].includes(savedSelection)) {
      setSelected(savedSelection);
    }
  }, []);

  useEffect(() => {
    if (selected !== null) {
      // Atualizar o localStorage sempre que selected mudar
      localStorage.setItem('selectedMenuItem', selected);
    }
  }, [selected]);

  return (
    <MenuContext.Provider value={{ selected, setSelected }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};
