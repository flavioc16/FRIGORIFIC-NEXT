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

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await api.post('/session', {
        username,
        password,
      });

      const { token, role } = response.data;

      // Configura o tempo de expiração para 1 mês a partir da data atual
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 1);

      // Verifica se está em ambiente de produção
      const isProduction = process.env.NODE_ENV === 'production';

      // Define as opções de HttpOnly e Secure com base no ambiente
      const cookieOptions = [
        `expires=${expires.toUTCString()}`,
        'path=/',
        isProduction ? 'Secure' : '', // Apenas em produção
        isProduction ? 'HttpOnly' : '', // Apenas em produção
      ]
        .filter(Boolean)
        .join('; ');

      // Armazena o token nos cookies com as opções configuradas
      document.cookie = `token=${token}; ${cookieOptions}`;

      // Redireciona com base na função do usuário
      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'USER') {
        toast.info('Realize o login no nosso APP.');
        //router.push('/user/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      toast.error('Erro ao realizar login. Verifique suas credenciais.');
    }
  }

  return (
    <>
      <div className={styles.containerCenter}>
        <Image 
          src={LOGOVERTICAL}
          alt='Logo pizzaria'
          width={443}
          height={169}
        />
    
        <section className={styles.login}>
          <form onSubmit={handleLogin}>
            <input 
              type="text"
              autoFocus
              required
              name='username'
              placeholder='Usuário'
              className={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input 
              type="password"
              required
              name='password'
              placeholder='Senha'
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">
              Entrar
            </button>
          </form>

          <Link href='/signup' className={styles.text}>
            Não sabe a senha? fale conosco
          </Link>

        </section>
      </div>

      <ToastContainer />
    </>
  );
}
