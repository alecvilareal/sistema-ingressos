// src/pages/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEventById, getTicketLots } from '../services/eventService';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import styles from './EventDetailPage.module.css'; // Importa os estilos

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchEventData = async () => {
      // ... (código useEffect existente, sem alterações)
    };
    fetchEventData();
  }, [eventId]);

  const handleQuantityChange = (lotId, quantity) => {
    // ... (código handleQuantityChange existente, sem alterações)
  };

  const handleAddToCart = (lot) => {
    // ... (código handleAddToCart existente, sem alterações)
  };

  if (loading) {
    return <p className={styles.loading}>A carregar detalhes do evento...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (!event) {
    return <p className={styles.error}>Evento não encontrado.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <img src={event.imageUrl} alt={event.name} className={styles.bannerImage} />
      
      <div className={styles.content}>
        <h1 className={styles.title}>{event.name}</h1>
        <div className={styles.metaInfo}>
          <span>🗓️ {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
          <span>📍 {event.location}</span>
        </div>
        
        <h3 className={styles.sectionTitle}>Sobre o Evento</h3>
        <p className={styles.description}>{event.description}</p>
        
        <h3 className={styles.sectionTitle}>Ingressos</h3>
        <div>
          {lots.length > 0 ? (
            lots.map(lot => (
              <div key={lot.id} className={styles.ticketLot}>
                <div className={styles.lotInfo}>
                  <p className={styles.lotName}>{lot.name}</p>
                  <p className={styles.lotPrice}>
                    {(lot.price || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </p>
                </div>
                <div className={styles.lotActions}>
                  <Input
                    type="number"
                    min="0"
                    max={lot.quantity}
                    value={quantities[lot.id] || 0}
                    onChange={(e) => handleQuantityChange(lot.id, e.target.value)}
                    className={styles.quantityInput}
                  />
                  <Button onClick={() => handleAddToCart(lot)}>
                    Adicionar
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum lote de ingresso disponível no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;