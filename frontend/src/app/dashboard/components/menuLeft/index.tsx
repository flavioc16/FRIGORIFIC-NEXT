import Link from 'next/link';
import styles from './styles.module.scss';

export default function MenuLeft() {
    return (
        <>  
            <div className={styles.menu}>
                <nav>
                    <Link href='/dashboard/clients' className={styles.text}>
                        Clientes
                    </Link>
                    <Link href='/dashboard/produtos' className={styles.text}>
                        Produtos
                    </Link>
                </nav>
            </div>
        </>
    );
}
