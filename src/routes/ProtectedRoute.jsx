// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  // Se não houver usuário logado, redireciona para a página de login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // Se houver usuário logado, renderiza o conteúdo da rota (as páginas filhas)
  return <Outlet />;
};

export default ProtectedRoute;