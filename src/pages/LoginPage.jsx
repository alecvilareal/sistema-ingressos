// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

// 1. Importa o nosso arquivo de estilos
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      navigate('/');
    } catch (err) {
      // Traduz as mensagens de erro do Firebase para algo mais amigável
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está a ser utilizado.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('E-mail ou senha inválidos.');
      } else {
        setError('Ocorreu um erro. Por favor, tente novamente.');
      }
    }
  };

  // Também vamos estilizar os nossos componentes reutilizáveis diretamente aqui
  // para que o estilo seja consistente nesta página.
  const StyledInput = (props) => <Input style={{ padding: '12px', fontSize: '1rem' }} {...props} />;
  const StyledButton = (props) => <Button style={{ padding: '12px', fontSize: '1rem', fontWeight: 'bold' }} {...props} />;

  return (
    // 2. Aplica as classes do objeto 'styles'
    <div className={styles.formContainer}>
      <h2 className={styles.title}>{isRegistering ? 'Criar Conta' : 'Aceder à Conta'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <StyledInput
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <StyledInput
          type="password"
          placeholder="Sua senha (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <StyledButton type="submit">
          {isRegistering ? 'Cadastrar' : 'Entrar'}
        </StyledButton>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <button onClick={() => setIsRegistering(!isRegistering)} className={styles.toggleButton}>
        {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Crie agora'}
      </button>
    </div>
  );
};

export default LoginPage;