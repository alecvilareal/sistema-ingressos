// src/pages/CheckoutPage.jsx
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { applyCoupon } from '../services/couponService';
import styles from './CheckoutPage.module.css'; // Importa os estilos

const CheckoutPage = () => {
  const { cartItems, cartSubtotal, cartTotal, discount, coupon, applyCouponToCart, removeCouponFromCart, removeFromCart } = useCart();
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  // Estado para o loading do pagamento, se quisermos reativar
  // const [loadingPayment, setLoadingPayment] = useState(false); 

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError('');
    try {
      const result = await applyCoupon(couponCodeInput, cartItems);
      if (result.data.success) {
        applyCouponToCart(result.data.couponData, result.data.discountAmount);
      }
    } catch (err) {
      setCouponError(err.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <h2>O seu carrinho está vazio.</h2>
        <Link to="/">
          <Button>Ver eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h2 className={styles.title}>Revisão do Pedido</h2>
      
      {cartItems.map(item => (
        <div key={item.id} className={styles.item}>
          <div className={styles.itemDetails}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemMeta}>{item.quantity} x {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <button onClick={() => removeFromCart(item.id)} className={styles.removeButton}>
            Remover
          </button>
        </div>
      ))}
      
      <div className={styles.couponSection}>
        {!coupon ? (
          <>
            <div className={styles.couponForm}>
              <Input 
                placeholder="Código do cupom" 
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value)}
              />
              <Button onClick={handleApplyCoupon}>Aplicar</Button>
            </div>
            {couponError && <p className={styles.couponError}>{couponError}</p>}
          </>
        ) : (
          <p className={styles.couponSuccess}>
            Cupom <strong>{coupon.code}</strong> aplicado! 
            <button onClick={removeCouponFromCart} style={{ all: 'unset', color: 'red', cursor: 'pointer', marginLeft: '10px' }}>(Remover)</button>
          </p>
        )}
      </div>
      
      <div className={styles.summary}>
        <p>Subtotal: {cartSubtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        {discount > 0 && <p className={styles.discountText}>Desconto: -{discount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>}
        <p className={styles.total}>
          Total: {cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
      
      <button 
        className={styles.paymentButton} 
        // onClick={handlePayment} - Reativar quando o pagamento for implementado
        // disabled={loadingPayment}
      >
        {/* {loadingPayment ? 'A processar...' : 'Ir para o Pagamento'} */}
        Ir para o Pagamento (Temporariamente desativado)
      </button>
    </div>
  );
};

export default CheckoutPage;