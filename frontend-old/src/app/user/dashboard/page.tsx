import Link from "next/link";
import styles from '../../page.module.scss'

export default function Dashboard(){
    return(
        <div>
            <h1>Pagina do painel Usuario</h1>
            <Link href='/' className={styles.text}>
                 Login
            </Link>
            <br />
            <Link href='/admin/dashboard' className={styles.text}>
                 Page admin
            </Link>
            <br />
            <Link href='/user/dashboard' className={styles.text}>
                Page user
            </Link>
        </div>
    )
}