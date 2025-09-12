// src/pages/MyTicketsPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTicketsByUserId } from '../services/ticketService';
import { QRCodeCanvas } from 'qrcode.react';
import styles from './MyTicketsPage.module.css'; // Importa os estilos

const MyTicketsPage = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleQrCodeId, setVisibleQrCodeId] = useState(null);

  useEffect(() => {
    // ... (código useEffect existente, sem alterações)
  }, [currentUser]);

  const toggleQrCode = (ticketId) => {
    setVisibleQrCodeId(prevId => (prevId === ticketId ? null : ticketId));
  };

  if (loading) return <p>A carregar os seus ingressos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2 className={styles.pageTitle}>Meus Ingressos</h2>
      {tickets.length > 0 ? (
        tickets.map(ticket => (
          <div key={ticket.id} className={styles.ticketCard}>
            <h3 className={styles.eventName}>{ticket.eventName}</h3>
            <p>
              Status: 
              <span className={`${styles.status} ${ticket.status === 'utilizado' ? styles.statusUsed : styles.statusPaid}`}>
                {ticket.status}
              </span>
            </p>
            <button onClick={() => toggleQrCode(ticket.id)} className={styles.qrButton}>
              {visibleQrCodeId === ticket.id ? 'Ocultar QR Code' : 'Mostrar QR Code'}
            </button>
            
            {visibleQrCodeId === ticket.id && (
              <div className={styles.qrContainer}>
                <QRCodeCanvas 
                  value={ticket.id}
                  size={256} 
                />
                <p className={styles.qrInstruction}>Apresente este código na entrada do evento.</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className={styles.noTicketsMessage}>Você ainda não possui ingressos.</p>
      )}
    </div>
  );
};

export default MyTicketsPage;