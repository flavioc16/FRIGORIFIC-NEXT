"use client";

import React from "react";  // Adicione essa linha
import useF2Redirect from "./useF2Redirect";

export default function ClientComponent() {
  useF2Redirect();  // Hook que faz o redirecionamento ao pressionar F2

  return <></>;  // Retorna um fragmento vazio, que é um ReactNode válido
}
