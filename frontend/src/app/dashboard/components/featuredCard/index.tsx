"use client";

import { ReactNode } from "react";
import Card from "react-bootstrap/Card";
import styles from "./styles.module.scss"; // Importação do arquivo de estilos

interface FeaturedCardProps {
  icon: ReactNode; // Prop para o ícone
}

export default function FeaturedCard({ icon }: FeaturedCardProps) {
  return (
    <Card className={`bg-dark text-white ${styles.cardCustom}`}>
      <Card.Body className={styles.cardBodyCustom}>
        {/* Renderizando o ícone passado como prop */}
        {icon}
      </Card.Body>
    </Card>
  );
}
