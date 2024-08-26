import { ArrowRight } from 'lucide-react';
import styles from './styles.module.scss'

export default function Button() {
  return (
    <button className={styles.Btn}>
      Avançar
      <ArrowRight className={styles.svg} />
    </button>
  );
}
