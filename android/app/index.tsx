import React, { useState, useContext, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  Image,
  ActivityIndicator 
} from 'react-native';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';
import { FontAwesome } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, loadingAuth } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const usernameRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    setErrorMessage(null);

    if (!username) {
      setErrorMessage('O campo de usuário precisa ser preenchido.');
      usernameRef.current?.focus(); // Foca no campo de usuário
      return;
    }

    if (!password) {
      setErrorMessage('O campo de senha precisa ser preenchido.');
      passwordRef.current?.focus(); // Foca no campo de senha
      return;
    }

    try {
      await signIn({ username, password });
    } catch (error: any) {
      console.log('Erro recebido:', error);

      // Caso o erro seja uma string ou um objeto, trate ambos
      let errorMsg = '';
  
      if (typeof error === 'string') {
        if (error.toLowerCase().includes('username') || error.toLowerCase().includes('password')) {
          errorMsg = 'Usuário ou senha incorretos.';
        }
      } else if (error?.message) {
        if (error.message.toLowerCase().includes('username') || error.message.toLowerCase().includes('password')) {
          errorMsg = 'Usuário ou senha incorretos.';
        }
      } else {
        errorMsg = 'Erro desconhecido. Tente novamente.';
      }
      setErrorMessage(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerImage}>
        <Image
          style={styles.logo}
          source={require('../assets/images/LOGOVERTICAL.png')}
          resizeMode="contain"
        />
      </View> 

      <View style={styles.usernameContainer}>
        <FontAwesome 
          name="user" // Ícone de usuário
          size={20}
          color="#888"
          style={styles.userButton}
        />
        <TextInput
          ref={usernameRef}
          style={styles.input}
          autoCapitalize="none"
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          autoFocus
          placeholderTextColor="#888"
        />
      </View>
      
      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordRef} 
          style={[styles.input, styles.passwordInput]} // Aplicando um estilo maior para o input
          placeholder="Senha"
          secureTextEntry={!isPasswordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888"
        />
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)} 
          style={styles.eyeButton}
        >
          <FontAwesome
            name={password === '' ? 'lock' : (isPasswordVisible ? 'eye' : 'eye-slash')}
            size={24}
            color="#888"
            style={[
              styles.eyeIcon,
              password === '' ? styles.lockIconMargin : styles.eyeIconMargin
            ]}
          />

        </TouchableOpacity>
      </View>

      <TouchableOpacity 
          onPress={handleLogin} 
          style={[styles.button, loadingAuth && styles.disabledButton]} 
          disabled={loadingAuth}
        >
          {loadingAuth ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>


      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d0f16',
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    paddingBottom: 190,
  },
  containerImage: {
    alignItems: 'center',
    marginBottom: 32,
  },

 
  input: {
    borderWidth: 1,
    borderColor: '#2d2d2d',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#fff',
    fontSize: 16,
    width: '100%',
  },
  passwordInput: {
    paddingRight: 40, // Espaço para o ícone do olho
  },
  logo: {
    width: '70%',
    height: 150,
    aspectRatio: 443 / 169,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#ae2121',
    borderRadius: 8,
    padding: 12,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#7e1a1a', // Cor mais clara para indicar o estado desabilitado
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    marginTop: 8,
    color: '#ff4d4d',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // Manter o contêiner para o ícone com posição relativa
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative', // Manter o contêiner para o ícone com posição relativa
  },
  eyeButton: {
    position: 'absolute',
    right: 1, // Ajustar para ficar com um pequeno espaço do lado direito
    top: '50%',
    transform: [{ translateY: -20 }], // Ajusta a posição vertical do ícone
  },
  userButton:{
    position: 'absolute',
    right: 20, // Ajustar para ficar com um pequeno espaço do lado direito
    top: '50%',
    transform: [{ translateY: -20 }], // Ajusta a posição vertical do ícone
  },
  eyeIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  lockIconMargin: {
    marginRight: 10, // margem específica para o 'lock'
  },
  eyeIconMargin: {
    marginRight: 15, // margem específica para 'eye' ou 'eye-slash'
  },
});

