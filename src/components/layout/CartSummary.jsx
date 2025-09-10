// src/components/layout/CartSummary.jsx
import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom'; // 1. Importe o Link

const CartSummary = () => {
  const { cartTotalItems, cartTotalPrice } = useCart();

  if (cartTotalItems === 0) {
    return null;
  }

  return (
    // 2. Envolva o div com um Link para a página de checkout
    <Link to="/checkout" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#007bff',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.9em'
      }}>
        🛒 {cartTotalItems} {cartTotalItems > 1 ? 'itens' : 'item'} - {cartTotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </div>
    </Link>
  );
};

export default CartSummary;