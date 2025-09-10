// src/pages/PaymentSuccessPage.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { useCart } from '../contexts/CartContext'; // Para limpar o carrinho

const PaymentSuccessPage = () => {
  const { clearCart } = useCart();

  // Limpa o carrinho assim que o usuário chega na página de sucesso
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: '#28a745' }}>Pagamento Aprovado! ✅</h1>
      <p>Seu pagamento foi processado com sucesso.</p>
      <p>Em breve, você receberá seus ingressos por e-mail e eles também estarão disponíveis na sua conta.</p>
      <div style={{ marginTop: '30px', display: 'inline-block' }}>
        <Link to="/">
          <Button>Voltar para a Página Inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;