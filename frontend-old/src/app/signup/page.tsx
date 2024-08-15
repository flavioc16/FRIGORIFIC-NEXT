import Link from "next/link";

import styles from '../page.module.scss'

export default function Signup(){
    return(
        <>
            <main>
                <h1>FALE CONOSCO</h1>
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
            </main>
            
        
        </>
    )
}