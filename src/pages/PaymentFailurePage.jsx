// src/pages/PaymentFailurePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const PaymentFailurePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 style={{ color: '#dc3545' }}>Falha no Pagamento ❌</h1>
      <p>Ocorreu um problema ao processar seu pagamento e ele não foi concluído.</p>
      <p>Nenhuma cobrança foi feita. Por favor, tente novamente.</p>
      <div style={{ marginTop: '30px', display: 'inline-block' }}>
        <Link to="/checkout">
          <Button>Tentar Novamente</Button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentFailurePage;