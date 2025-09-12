import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../config/firebaseConfig'; // Importa apenas o 'auth'
import { signUp, signIn, signOutUser } from '../services/authService';

// 1. Cria o Contexto
const AuthContext = createContext();

// 2. Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // NOVO ESTADO PARA O PAPEL
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Se um usuário estiver logado, busca o token para ler os custom claims.
        user.getIdTokenResult(true).then((idTokenResult) => {
          // Acessa o campo 'role' que definimos no backend.
          // Se não houver 'role', assume 'cliente' como padrão.
          const role = idTokenResult.claims.role || 'cliente';
          setUserRole(role);
          setLoading(false);
        });
      } else {
        // Se não houver usuário, limpa o papel e finaliza o carregamento.
        setUserRole(null);
        setLoading(false);
      }
    });

    return unsubscribe; // Limpa o listener ao desmontar o componente
  }, []);

  // O valor que será fornecido para todos os componentes filhos
  const value = {
    currentUser,
    userRole, // DISPONIBILIZA O PAPEL PARA A APLICAÇÃO
    loading,
    signIn,
    signUp,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  return useContext(AuthContext);
};