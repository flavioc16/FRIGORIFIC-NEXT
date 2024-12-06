"use client"; // Garantindo que o código seja executado no lado do cliente

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; // Importando os hooks useRouter e usePathname do Next.js

export default function useF2Redirect() {
  const router = useRouter(); // Usando o hook useRouter para redirecionar
  const pathname = usePathname(); // Obtém a rota atual
  const searchInputRef = useRef<HTMLInputElement>(null); // Ref para o campo de pesquisa

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "F2") {
        // Remove o foco do elemento ativo, se houver
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }

        // Flag para verificar se o redirecionamento ocorreu
        let redirectHandled = false;

        // Função para tentar redirecionar via router.push
        const tryRouterPush = () => {
          const start = performance.now(); // Marca o início do tempo
          router.push("/dashboard");
          redirectHandled = true;

          // Verifica após 300ms se o redirecionamento ainda não ocorreu
          const timeout = setTimeout(() => {
            const elapsed = performance.now() - start; // Calcula o tempo decorrido
            if (!redirectHandled && elapsed >= 300) {
              // Fallback para window.location.replace se o router.push atrasar
              window.location.replace("/dashboard");
            }
          }, 300);

          // Cancela o timeout caso o redirecionamento tenha ocorrido rapidamente
          return () => clearTimeout(timeout);
        };

        // Se a rota atual for "/dashboard/purchases/:idcliente"
        if (pathname?.startsWith("/dashboard/purchases/")) {
          // Usa window.location.replace para redirecionar rapidamente
          window.location.replace("/dashboard");
        } else {
          // Tenta redirecionar com router.push e usa fallback em caso de atraso
          tryRouterPush();
        }

        // Dá foco ao campo de pesquisa após o redirecionamento
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 200); // Delay ajustável conforme necessário
      }
    };

    // Adiciona o ouvinte de evento quando o componente é montado
    window.addEventListener("keydown", handleKeyDown);

    // Limpa o ouvinte de evento quando o componente é desmontado
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router, pathname]); // Dependências incluem router e pathname

  return { searchInputRef }; // Retorna a referência do input de pesquisa
}
