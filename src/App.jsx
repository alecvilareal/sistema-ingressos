// src/App.jsx
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      {/* Futuramente, aqui entrará o <Navbar /> */}
      <main>
        <Outlet /> {/* As páginas (HomePage, LoginPage) serão renderizadas aqui */}
      </main>
      {/* Futuramente, aqui entrará o <Footer /> */}
    </div>
  );
}

export default App;