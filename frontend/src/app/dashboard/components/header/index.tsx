'use client'

import Link from 'next/link';
import styles from './styles.module.scss';
import Image from 'next/image';
import { LogOutIcon } from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

import LOGOVERTICAL from '/public/LOGOVERTICAL.png';

export function Header() {

    const router = useRouter();

    async function handleLogout() {
        deleteCookie("token", { path: "/" });

        router.replace("/");
    }

    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard">
                    <Image alt='Logo Frigorifico'
                        src={LOGOVERTICAL}
                        width={167}
                        height={63}
                        


                        priority={true}
                        quality={100}
                    />
                </Link>

                <nav>
                    <Link href="/dashboard/clients">
                        Clientes
                    </Link>
                    <form action={handleLogout}>
                        <button type='submit'>
                            <LogOutIcon size={22} color='#FFF' />
                        </button>
                    </form>
                </nav>
            </div>
           
        </header>
    );
}
