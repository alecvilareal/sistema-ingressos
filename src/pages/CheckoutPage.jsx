import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebaseConfig';
import { useAuth } from '../contexts/AuthContext'; // Importe para verificar se o usuário está logado

const CheckoutPage = () => {
  const { cartItems, cartTotalPrice, removeFromCart } = useCart();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    // Verificação extra para garantir que o usuário está logado antes de pagar
    if (!currentUser) {
      setError("Você precisa estar logado para finalizar a compra.");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepara a chamada para nossa cloud function 'createPaymentPreference'
      const createPaymentPreference = httpsCallable(functions, 'createPaymentPreference');
      const result = await createPaymentPreference({ cartItems });
      
      // Pega o link de pagamento da resposta e redireciona o usuário
      const paymentUrl = result.data.init_point;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Link de pagamento não recebido.");
      }

    } catch (error) {
      console.error("Erro ao processar pagamento: ", error);
      setError("Ocorreu um erro ao iniciar o pagamento. Por favor, tente novamente.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Seu carrinho está vazio.</h2>
        <Link to="/">
          <Button style={{maxWidth: '250px'}}>Ver eventos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Revisão do Pedido</h2>
      
      {cartItems.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', padding: '10px 0', margin: '10px 0' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
            <p style={{ margin: 0, color: '#555' }}>{item.quantity} x {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
          </div>
          <Button onClick={() => removeFromCart(item.id)} style={{ background: '#dc3545', fontSize: '0.8em' }}>
            Remover
          </Button>
        </div>
      ))}
      
      <div style={{ textAlign: 'right', marginTop: '20px', fontSize: '1.2em' }}>
        <strong>Total: {cartTotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
      </div>
      
      {error && <p style={{ color: 'red', textAlign: 'right' }}>{error}</p>}
      
      <div style={{ textAlign: 'right', marginTop: '20px' }}>
        <Button
          onClick={handlePayment}
          disabled={loading}
          style={{ background: '#28a745', padding: '15px 30px', fontSize: '1.1em' }}
        >
          {loading ? 'Processando...' : 'Finalizar Pagamento'}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;