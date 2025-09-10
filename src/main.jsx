// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRoutes } from './routes';
import './index.css';

import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext'; // 1. Importe o CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* 2. Envolva o AppRoutes também com o CartProvider */}
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);