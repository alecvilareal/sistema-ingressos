// src/App.jsx
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import CartSummary from "./components/layout/CartSummary"; // 1. Importe o CartSummary

function App() {
  const { currentUser, signOutUser } = useAuth();

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#333', color: 'white' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h1>Sistema de Ingressos</h1></Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <CartSummary /> {/* 2. Adicione o componente aqui */}
          {currentUser ? (
            <>
              <span>Bem-vindo, {currentUser.email}</span>
              <button onClick={signOutUser} style={{ marginLeft: '10px' }}>Sair</button>
            </>
          ) : (
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
          )}
        </div>
      </nav>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;