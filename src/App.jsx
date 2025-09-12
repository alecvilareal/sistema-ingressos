import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CartSummary from "./components/layout/CartSummary";

function App() {
  const { currentUser, userRole, signOutUser } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#2c3e50',
        color: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Ingressos APP
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CartSummary />
          
          {currentUser ? (
            <>
              {/* --- LINK DE ADMIN (Temporariamente desativado) --- */}
              {/*
              {userRole === 'admin' && (
                <Link to="/admin/users" style={{ color: '#f1c40f', fontWeight: 'bold', textDecoration: 'none' }}>
                  Admin
                </Link>
              )}
              */}
              
              <Link to="/my-tickets" style={{ color: 'white', textDecoration: 'none' }}>
                Meus Ingressos
              </Link>
              <Link to="/organizer/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
                Painel do Organizador
              </Link>
              <span style={{ borderLeft: '1px solid #7f8c8d', paddingLeft: '20px' }}>
                Olá, {currentUser.email}
              </span>
              <button 
                onClick={handleSignOut} 
                style={{ 
                  background: '#e74c3c', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 12px', 
                  borderRadius: '5px', 
                  cursor: 'pointer' 
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Entrar / Cadastrar
            </Link>
          )}
        </div>
      </nav>

      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
      
      <footer style={{
        textAlign: 'center',
        padding: '1rem',
        marginTop: '2rem',
        background: '#ecf0f1',
        color: '#34495e',
        borderTop: '1px solid #bdc3c7'
      }}>
        <p>&copy; {new Date().getFullYear()} Sistema de Ingressos. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;