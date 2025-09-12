import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Este componente recebe um array de papéis permitidos como 'prop'
const RoleBasedRoute = ({ allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  // Se ainda estiver a carregar a informação de autenticação, mostra uma mensagem
  if (loading) {
    return <div>A carregar...</div>;
  }

  // Se não houver usuário logado, redireciona para a página de login
  if (!currentUser) {
    // Guarda a página que o usuário tentou aceder para redirecioná-lo de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se a rota requer papéis específicos e o papel do usuário não está na lista,
  // redireciona para a página inicial (ou uma página de "acesso negado")
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Se o usuário está logado e tem a permissão necessária, renderiza a página solicitada
  return <Outlet />;
};

export default RoleBasedRoute;