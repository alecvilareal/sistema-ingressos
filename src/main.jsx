// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './routes';
import './index.css';

// 1. Importe o AuthProvider
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. Envolva o AppRoutes com o AuthProvider */}
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>,
);