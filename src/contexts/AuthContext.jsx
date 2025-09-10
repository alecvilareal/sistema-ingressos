// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { listenAuthState, signIn, signUp, signOutUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber se a autenticação inicial já carregou

  useEffect(() => {
    // A função 'listenAuthState' nos retorna a função de 'unsubscribe'
    const unsubscribe = listenAuthState((user) => {
      setCurrentUser(user);
      setLoading(false); // Marca que o carregamento inicial terminou
    });

    // Função de limpeza: será executada quando o componente for desmontado
    return unsubscribe;
  }, []);

  // O valor que será fornecido para todos os componentes filhos
  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOutUser,
  };

  // Não renderiza nada até que o estado de autenticação seja verificado
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Cria um Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};