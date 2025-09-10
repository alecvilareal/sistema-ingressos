// src/App.jsx
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"; // Importe o hook

function App() {
  const { currentUser, signOutUser } = useAuth(); // Use o hook para pegar o usuário e a função de logout

  return (
    <div>
      <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: '#333', color: 'white' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}><h1>Sistema de Ingressos</h1></Link>
        <div>
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