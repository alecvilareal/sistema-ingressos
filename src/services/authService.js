// src/services/authService.js

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebaseConfig"; // Nosso objeto 'auth' exportado

// Função para cadastrar um novo usuário
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Opcional: retornar o usuário ou uma mensagem de sucesso
    return userCredential.user;
  } catch (error) {
    // Tratar erros comuns aqui (ex: email já em uso)
    console.error("Erro no cadastro:", error.message);
    throw error; // Lança o erro para ser pego no componente
  }
};

// Função para logar um usuário existente
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    // Tratar erros comuns (ex: senha incorreta, usuário não encontrado)
    console.error("Erro no login:", error.message);
    throw error;
  }
};

// Função para fazer logout
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erro no logout:", error.message);
    throw error;
  }
};

// (Opcional, mas muito útil) Um observador para o estado de autenticação
// Você pode exportar isso se precisar em algum lugar, mas vamos centralizar no Contexto
import { onAuthStateChanged } from "firebase/auth";

export const listenAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};