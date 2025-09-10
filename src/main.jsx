// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './routes'; // Importe nosso componente de rotas
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppRoutes /> {/* Renderize as rotas em vez do App diretamente */}
  </React.StrictMode>,
);