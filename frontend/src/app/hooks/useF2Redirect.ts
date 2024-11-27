"use client"; // Garantindo que o código seja executado no lado do cliente

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";  // Importando o hook useRouter do Next.js

// Definindo o hook que escuta o evento de pressionamento da tecla F2
export default function useF2Redirect() {
  const router = useRouter();  // Usando o hook useRouter para redirecionar
  const searchInputRef = useRef<HTMLInputElement>(null);  // Ref para o campo de pesquisa

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        // Se a tecla F2 for pressionada, faz o blur no elemento com foco antes de redirecionar
        const activeElement = document.activeElement as HTMLElement; // Garantir que o elemento é do tipo HTMLElement
        if (activeElement) {
          activeElement.blur();  // Perde o foco do elemento que está com foco
        }

        // Redireciona para o dashboard
        router.push("/dashboard");

        // Dá foco ao campo de pesquisa após o redirecionamento, com um pequeno delay
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 200); // Delay de 200ms, ajustável conforme necessário
      }
    };

    // Adiciona o ouvinte de evento quando o componente é montado
    window.addEventListener("keydown", handleKeyDown);

    // Limpa o ouvinte de evento quando o componente é desmontado
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]); // O useEffect será executado apenas quando 'router' mudar

  return { searchInputRef };  // Retorna a referência do input de pesquisa
}
