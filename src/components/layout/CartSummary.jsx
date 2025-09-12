import React from 'react';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';

const CartSummary = () => {
  // --- CORREÇÃO APLICADA AQUI ---
  // Trocamos 'cartTotalPrice' por 'cartTotal' para corresponder ao que o Contexto fornece.
  const { cartTotalItems, cartTotal } = useCart();

  if (cartTotalItems === 0) {
    return null;
  }

  // Agora usamos a variável 'cartTotal' que tem o valor correto.
  const formattedPrice = (typeof cartTotal === 'number' ? cartTotal : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });

  return (
    <Link to="/checkout" style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#007bff',
        color: 'white',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.9em'
      }}>
        🛒 {cartTotalItems} {cartTotalItems > 1 ? 'itens' : 'item'} - {formattedPrice}
      </div>
    </Link>
  );
};

export default CartSummary;
