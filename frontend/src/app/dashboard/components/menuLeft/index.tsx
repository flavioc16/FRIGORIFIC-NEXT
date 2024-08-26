import Link from 'next/link';
import { User, Package } from 'lucide-react'; // Ícones do Lucide
import styles from './styles.module.scss';

export default function MenuLeft() {
  return (
    <div className={styles.menu}>
      <h1>Menu</h1>
      <nav>
        <Link href='/dashboard/clients'>
          <User /> Clientes
        </Link>
        <Link href='/dashboard/produtos'>
          <Package /> Produtos
        </Link>
      </nav>
    </div>
  );
}
