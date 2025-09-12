import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTicketsByUserId } from '../services/ticketService';
// CORREÇÃO 1: Importa o componente específico QRCodeCanvas
import { QRCodeCanvas } from 'qrcode.react'; 

const MyTicketsPage = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [visibleQrCodeId, setVisibleQrCodeId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      if (currentUser) {
        try {
          const userTickets = await getTicketsByUserId(currentUser.uid);
          setTickets(userTickets);
        } catch (err) {
          setError('Não foi possível carregar seus ingressos.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTickets();
  }, [currentUser]);

  const toggleQrCode = (ticketId) => {
    setVisibleQrCodeId(prevId => (prevId === ticketId ? null : ticketId));
  };

  if (loading) return <p>A carregar os seus ingressos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      <h2>Meus Ingressos</h2>
      {tickets.length > 0 ? (
        tickets.map(ticket => (
          <div key={ticket.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3>{ticket.eventName}</h3>
            <p>Status: <span style={{ color: 'green', fontWeight: 'bold' }}>{ticket.status}</span></p>
            <button onClick={() => toggleQrCode(ticket.id)} style={{ padding: '10px', cursor: 'pointer' }}>
              {visibleQrCodeId === ticket.id ? 'Ocultar QR Code' : 'Mostrar QR Code'}
            </button>
            {visibleQrCodeId === ticket.id && (
              <div style={{ marginTop: '20px', padding: '20px', background: 'white', display: 'inline-block' }}>
                {/* CORREÇÃO 2: Usa o componente QRCodeCanvas */}
                <QRCodeCanvas 
                  value={ticket.id}
                  size={256} 
                />
                <p>Apresente este código na entrada do evento.</p>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>Você ainda não possui ingressos.</p>
      )}
    </div>
  );
};

export default MyTicketsPage;