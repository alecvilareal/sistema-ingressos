// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (lot, quantity) => {
    // Verifica se o item já está no carrinho
    const existingItem = cartItems.find(item => item.id === lot.id);

    if (existingItem) {
      // Se já existe, apenas atualiza a quantidade
      setCartItems(cartItems.map(item =>
        item.id === lot.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      // Se não existe, adiciona o novo item com a quantidade
      setCartItems([...cartItems, { ...lot, quantity }]);
    }
  };

  const removeFromCart = (lotId) => {
    setCartItems(cartItems.filter(item => item.id !== lotId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calcula o total de itens e o valor total do carrinho
  const cartTotalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotalItems,
    cartTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useCart = () => {
  return useContext(CartContext);
};