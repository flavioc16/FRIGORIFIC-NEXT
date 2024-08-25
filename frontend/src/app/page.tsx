'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { api } from '@/services/api';
import styles from './page.module.scss';

import LOGOVERTICAL from '/public/LOGOVERTICAL.png';
import Image from 'next/image';
import Link from 'next/link';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BeatLoader } from 'react-spinners';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/session', {
        username,
        password,
      });

      const { token, role } = response.data;

      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);

      const isProduction = process.env.NODE_ENV === 'production';
      const cookieOptions = [
        `expires=${expires.toUTCString()}`,
        'path=/',
        isProduction ? 'Secure' : '',
        isProduction ? 'HttpOnly' : '',
      ]
        .filter(Boolean)
        .join('; ');

      document.cookie = `token=${token}; ${cookieOptions}`;

      if (role === 'ADMIN') {
        router.push('/dashboard');
      } else if (role === 'USER') {
        toast.info('Realize o login no nosso APP.');
      } else {
        router.push('/');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Erro ao realizar login:', error);
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div
        className={`${styles.containerCenter} ${
          isLoading ? styles.loading : ''
        }`} // Adiciona a classe loading durante o estado de carregamento
      >
        <Image
          src={LOGOVERTICAL}
          alt="Logo pizzaria"
          width={443}
          height={169}
          className={styles.logo}
        />

        <section className={styles.login}>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              autoFocus
              required
              name="username"
              placeholder="Usuário"
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              required
              name="password"
              placeholder="Senha"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? <BeatLoader color="#fff" size={6} /> : 'Entrar'}
            </button>
          </form>

          <Link href="/signup" className={styles.text}>
            Não sabe a senha? fale conosco
          </Link>
        </section>
      </div>

      <ToastContainer />
    </>
  );
}
