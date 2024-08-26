'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import { api } from '@/services/api';
import styles from './page.module.scss';

import LOGOVERTICAL from '/public/LOGOVERTICAL.png';
import Image from 'next/image';
import Link from 'next/link';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BeatLoader } from 'react-spinners';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
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

  // Função para alternar a visualização da senha e posicionar o cursor no final do input
  function toggleShowPassword() {
    setShowPassword(!showPassword);

    // Aguarda a renderização antes de focar no campo e mover o cursor para o final
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
        passwordInputRef.current.setSelectionRange(password.length, password.length);
      }
    }, 0);
  }

  return (
    <>
      <div
        className={`${styles.containerCenter} ${
          isLoading ? styles.loading : ''
        }`}
      >
        <Image
          src={LOGOVERTICAL}
          alt="Logo pizzaria"
          width={443}
          height={169}
          className={styles.logo}
        />

        <section className={styles.login}>
          <form onSubmit={handleLogin} className={styles.form}>
            <div className={styles.inputContainer}>
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
              <User className={styles.icon} />
            </div>

            <div className={styles.inputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                name="password"
                placeholder="Senha"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
              />
              {password === '' ? (
                <Lock
                  className={styles.icon}
                  onClick={() => passwordInputRef.current?.focus()}
                />
              ) : showPassword ? (
                <Eye
                  className={styles.icon}
                  onClick={toggleShowPassword}
                />
              ) : (
                <EyeOff
                  className={styles.icon}
                  onClick={toggleShowPassword}
                />
              )}
            </div>

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
