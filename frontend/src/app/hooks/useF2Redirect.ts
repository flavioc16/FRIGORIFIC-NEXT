"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function useF2Redirect() {
  const router = useRouter();
  const pathname = usePathname(); // Usando usePathname para obter a rota atual

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F2') {
        // Verifica se não está na rota de login antes de redirecionar
        if (pathname !== '/login') {
          router.push('/dashboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pathname, router]); // Incluindo `pathname` como dependência
}
