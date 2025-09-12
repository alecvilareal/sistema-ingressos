import React from 'react';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CartSummary from "./components/layout/CartSummary";

// Importa o nosso novo arquivo de CSS para estilizar este componente
import './App.css'; 

function App() {
  const { currentUser, userRole, signOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      // Redireciona o usuário para a página inicial após o logout
      navigate('/'); 
    } catch (error) {
      console.error("Falha ao fazer logout", error);
      alert("Ocorreu um erro ao sair.");
    }
  };

  return (
    <div className="app-layout">
      <nav className="main-nav">
        <div className="container nav-content">
          <Link to="/" className="nav-brand">
            Ingressos APP
          </Link>
          
          <div className="nav-menu">
            <CartSummary />
            
            {currentUser ? (
              <div className="nav-user-actions">
                {/* Links Condicionais Baseados no Papel (Role) */}
                {userRole === 'admin' && (
                  <Link to="/admin/users">Admin</Link>
                )}
                
                {/* Assumindo que o painel é para qualquer tipo de "staff" */}
                {(userRole === 'admin' || userRole === 'funcionario' || userRole === 'promoter') && (
                    <Link to="/organizer/dashboard">Painel</Link>
                )}

                <Link to="/my-tickets">Meus Ingressos</Link>
                <span>Olá, {currentUser.email}</span>
                <button onClick={handleSignOut} className="logout-button">Sair</button>
              </div>
            ) : (
              <Link to="/login">Entrar / Cadastrar</Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container main-content">
        <Outlet />
      </main>
      
      <footer className="main-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Sistema de Ingressos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

