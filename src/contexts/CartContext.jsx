// src/contexts/CartContext.jsx
import React, { createContext, useState, useContext, useMemo } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  const addToCart = (lot, quantity, eventDetails) => {
    // Adiciona detalhes do evento ao item do carrinho
    const itemToAdd = { 
        ...lot, 
        quantity, 
        eventId: eventDetails.id, 
        eventName: eventDetails.name 
    };
    
    const existingItem = cartItems.find(item => item.id === itemToAdd.id);

    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === itemToAdd.id ? { ...item, quantity: item.quantity + quantity } : item
      ));
    } else {
      setCartItems([...cartItems, itemToAdd]);
    }
  };
  
  const removeFromCart = (lotId) => {
    setCartItems(cartItems.filter(item => item.id !== lotId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setDiscount(0);
  };

  const applyCouponToCart = (couponData, discountAmount) => {
    setCoupon(couponData);
    setDiscount(discountAmount);
  };

  const removeCouponFromCart = () => {
    setCoupon(null);
    setDiscount(0);
  };

  // --- CORREÇÃO APLICADA AQUI ---
  // A lógica de cálculo agora verifica se 'item.price' existe
  const cartSubtotal = useMemo(() => 
    cartItems.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0), 
    [cartItems]
  );
  // ------------------------------

  const cartTotal = useMemo(() => 
    Math.max(0, cartSubtotal - discount), 
    [cartSubtotal, discount]
  );

  const cartTotalItems = useMemo(() => 
    cartItems.reduce((total, item) => total + item.quantity, 0), 
    [cartItems]
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartTotal,
    cartTotalItems,
    coupon,
    discount,
    applyCouponToCart,
    removeCouponFromCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};